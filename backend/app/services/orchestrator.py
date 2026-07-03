"""Agent orchestration.

The orchestrator owns the agent fleet: provisioning the default agents for
a new tenant, dispatching tasks, executing them asynchronously, and writing
results into long-term memory so future RAG queries benefit from the work.

Execution runs in-process via asyncio tasks; at scale, swap `_execute` to
enqueue onto a worker (Celery/Arq/SQS) — the interface stays the same.
"""
import asyncio
from datetime import datetime, timezone

import structlog
from sqlalchemy.orm import Session

from app.db.models import Agent, TaskRun
from app.db.session import SessionLocal
from app.services.llm import llm
from app.services.memory import memory_core

log = structlog.get_logger()

DEFAULT_FLEET = [
    {"slug": "atlas", "name": "Atlas", "role": "Market & Competitor Research", "namespace": "market"},
    {"slug": "orion", "name": "Orion", "role": "Sales & Lead Outreach", "namespace": "sales"},
    {"slug": "lyra", "name": "Lyra", "role": "Content & Social", "namespace": "content"},
    {"slug": "vega", "name": "Vega", "role": "Business Data & Analytics", "namespace": "analysis"},
    {"slug": "nova", "name": "Nova", "role": "Inbox & Customer Comms", "namespace": "comms"},
    {"slug": "sol", "name": "Sol", "role": "Day Planner & Scheduler", "namespace": "knowledge"},
]

AGENT_SYSTEM = """You are {name}, a specialist AI agent ({role}) inside Blueman.
Execute the task and reply with a short, actionable result (max 150 words).
Lead with the concrete finding or outcome, not process."""


class Orchestrator:
    def provision_fleet(self, db: Session, user_id: int) -> list[Agent]:
        """Create the default six agents for a new tenant (idempotent)."""
        existing = {a.slug for a in db.query(Agent).filter_by(user_id=user_id)}
        created = []
        for spec in DEFAULT_FLEET:
            if spec["slug"] not in existing:
                agent = Agent(user_id=user_id, **spec)
                db.add(agent)
                created.append(agent)
        db.commit()
        return created

    def list_agents(self, db: Session, user_id: int) -> list[Agent]:
        agents = db.query(Agent).filter_by(user_id=user_id).all()
        if not agents:
            self.provision_fleet(db, user_id)
            agents = db.query(Agent).filter_by(user_id=user_id).all()
        return agents

    def set_status(self, db: Session, user_id: int, slug: str, status: str) -> Agent | None:
        agent = db.query(Agent).filter_by(user_id=user_id, slug=slug).first()
        if agent:
            agent.status = status
            db.commit()
        return agent

    async def dispatch(self, db: Session, user_id: int, slug: str, task: str) -> TaskRun:
        """Record the task and execute it in the background."""
        run = TaskRun(user_id=user_id, agent_slug=slug, task=task)
        db.add(run)
        db.commit()
        asyncio.create_task(self._execute(run.id))
        log.info("task_dispatched", agent=slug, run_id=run.id)
        return run

    async def _execute(self, run_id: int) -> None:
        """Background execution with its own DB session (never share sessions
        across asyncio tasks)."""
        db = SessionLocal()
        try:
            run = db.get(TaskRun, run_id)
            if run is None:
                return
            spec = next((s for s in DEFAULT_FLEET if s["slug"] == run.agent_slug), DEFAULT_FLEET[0])
            try:
                text, tin, tout = await llm.complete(
                    [{"role": "user", "content": run.task}],
                    system=AGENT_SYSTEM.format(name=spec["name"], role=spec["role"]),
                    max_tokens=500,
                )
                run.status, run.result = "completed", {"text": text}
                run.tokens_in, run.tokens_out = tin, tout
                # Persist the finding so future RAG queries can use it.
                await memory_core.store(
                    db, run.user_id, text, spec["namespace"], source_agent=spec["name"]
                )
            except Exception as exc:
                run.status, run.result = "failed", {"error": str(exc)}
                log.error("task_failed", run_id=run_id, error=str(exc))
            run.finished_at = datetime.now(timezone.utc)
            db.commit()
        finally:
            db.close()


orchestrator = Orchestrator()
