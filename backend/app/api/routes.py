"""Public API routes.

Paths intentionally match what the shipped frontend (src/api.js) already
calls: /health, /v1/chat/completions, /v1/managed-agents, /v1/memory/search,
/api/digest — so pointing the UI at this server "just works".
"""
import json

import structlog
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app import schemas
from app.api.deps import get_current_user, get_paying_user
from app.core.security import create_access_token, hash_password, verify_password
from app.db.models import TaskRun, User
from app.db.session import get_db
from app.services.brain import brain
from app.services.llm import llm
from app.services.memory import memory_core
from app.services.orchestrator import orchestrator

log = structlog.get_logger()
router = APIRouter()


# ---- health / info ---------------------------------------------------------
@router.get("/health")
def health() -> dict:
    return {"status": "ok", "llm": llm.available}


@router.get("/v1/info")
def info() -> dict:
    return {"name": "Blueman", "version": "1.0.0"}


# ---- auth -------------------------------------------------------------------
@router.post("/v1/auth/signup", response_model=schemas.TokenResponse)
def signup(body: schemas.SignupRequest, db: Session = Depends(get_db)):
    if db.query(User).filter_by(email=body.email).first():
        raise HTTPException(409, "Email already registered")
    user = User(
        email=body.email,
        hashed_password=hash_password(body.password),
        display_name=body.display_name,
    )
    db.add(user)
    db.commit()
    orchestrator.provision_fleet(db, user.id)
    return schemas.TokenResponse(access_token=create_access_token(user.email, user.plan), plan=user.plan)


@router.post("/v1/auth/login", response_model=schemas.TokenResponse)
def login(body: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter_by(email=body.email).first()
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(401, "Invalid credentials")
    return schemas.TokenResponse(access_token=create_access_token(user.email, user.plan), plan=user.plan)


@router.get("/v1/auth/me", response_model=schemas.MeResponse)
def me(user: User = Depends(get_current_user)):
    return user


# ---- chat (the Brain) --------------------------------------------------------
@router.post("/v1/chat/completions")
async def chat(
    body: schemas.ChatRequest,
    user: User = Depends(get_paying_user),
    db: Session = Depends(get_db),
):
    messages = [m.model_dump() for m in body.messages]

    if body.stream:
        async def sse():
            async for delta in llm.stream(messages):
                chunk = {"choices": [{"delta": {"content": delta}}]}
                yield f"data: {json.dumps(chunk)}\n\n"
            yield "data: [DONE]\n\n"

        return StreamingResponse(sse(), media_type="text/event-stream")

    result = await brain.think(db, user.id, user.display_name, messages)
    return {
        "choices": [{"message": {"role": "assistant", "content": result["text"]}}],
        "usage": {
            "prompt_tokens": result["tokens_in"],
            "completion_tokens": result["tokens_out"],
        },
        "blueman": {"delegated": result["delegated"], "agent": result["agent"]},
    }


# ---- agents -------------------------------------------------------------------
@router.get("/v1/managed-agents", response_model=list[schemas.AgentOut])
def list_agents(user: User = Depends(get_paying_user), db: Session = Depends(get_db)):
    return orchestrator.list_agents(db, user.id)


@router.post("/v1/managed-agents/{slug}/pause", response_model=schemas.AgentOut)
def pause_agent(slug: str, user: User = Depends(get_paying_user), db: Session = Depends(get_db)):
    agent = orchestrator.set_status(db, user.id, slug, "paused")
    if not agent:
        raise HTTPException(404, "Agent not found")
    return agent


@router.post("/v1/managed-agents/{slug}/resume", response_model=schemas.AgentOut)
def resume_agent(slug: str, user: User = Depends(get_paying_user), db: Session = Depends(get_db)):
    agent = orchestrator.set_status(db, user.id, slug, "active")
    if not agent:
        raise HTTPException(404, "Agent not found")
    return agent


@router.post("/v1/managed-agents/{slug}/run", response_model=schemas.TaskRunOut)
async def run_agent(
    slug: str,
    body: schemas.RunTaskRequest,
    user: User = Depends(get_paying_user),
    db: Session = Depends(get_db),
):
    return await orchestrator.dispatch(db, user.id, slug, body.task)


@router.get("/v1/activity", response_model=list[schemas.TaskRunOut])
def activity(user: User = Depends(get_paying_user), db: Session = Depends(get_db)):
    return (
        db.query(TaskRun)
        .filter_by(user_id=user.id)
        .order_by(TaskRun.started_at.desc())
        .limit(30)
        .all()
    )


# ---- memory ---------------------------------------------------------------------
@router.get("/v1/memory/search")
async def memory_search(q: str, user: User = Depends(get_paying_user)):
    hits = await memory_core.recall(user.id, q)
    return {"results": hits}


@router.post("/v1/memory")
async def memory_store(
    body: schemas.MemoryStoreRequest,
    user: User = Depends(get_paying_user),
    db: Session = Depends(get_db),
):
    entry = await memory_core.store(
        db, user.id, body.text, body.namespace, importance=body.importance
    )
    return {"id": entry.id}


# ---- daily digest -----------------------------------------------------------------
DIGEST_PROMPT = (
    "Generate a morning briefing for the business owner. Summarize what matters "
    "from the business context, list up to 4 items that need their attention, "
    "and keep it under 120 words. Format: plain text summary."
)


@router.get("/api/digest")
async def get_digest(user: User = Depends(get_paying_user), db: Session = Depends(get_db)):
    result = await brain.think(
        db, user.id, user.display_name, [{"role": "user", "content": DIGEST_PROMPT}]
    )
    return {"greeting": f"Good morning, {user.display_name or 'there'}", "summary": result["text"]}


@router.post("/api/digest/generate")
async def regenerate_digest(user: User = Depends(get_paying_user), db: Session = Depends(get_db)):
    return await get_digest(user, db)


# ---- connectors (stub until OAuth flows are wired) ---------------------------------
@router.get("/v1/connectors")
def connectors(user: User = Depends(get_paying_user)):
    return {"connectors": []}
