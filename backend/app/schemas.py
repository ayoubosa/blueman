"""Pydantic request/response contracts for the public API."""
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


# ---- auth ----------------------------------------------------------------
class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    display_name: str = ""


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    plan: str


class MeResponse(BaseModel):
    email: str
    display_name: str
    plan: str
    plan_status: str


# ---- chat (OpenAI-compatible shape, matches frontend api.js) --------------
class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    model: str = "default"
    messages: list[ChatMessage]
    temperature: float | None = 0.7
    stream: bool = False


# ---- agents ----------------------------------------------------------------
class AgentOut(BaseModel):
    slug: str
    name: str
    role: str
    status: str
    model: str
    namespace: str
    tasks_completed: int

    model_config = {"from_attributes": True}


class RunTaskRequest(BaseModel):
    task: str


# ---- memory ----------------------------------------------------------------
class MemoryStoreRequest(BaseModel):
    text: str
    namespace: str = "knowledge"
    importance: float = 0.5


class MemoryHit(BaseModel):
    text: str
    namespace: str
    source_agent: str = ""
    score: float


# ---- activity ----------------------------------------------------------------
class TaskRunOut(BaseModel):
    id: int
    agent_slug: str
    task: str
    status: str
    started_at: datetime
    finished_at: datetime | None

    model_config = {"from_attributes": True}
