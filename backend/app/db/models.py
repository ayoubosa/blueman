"""Database schema.

Designed for thousands of tenants: every business-data table carries a
user_id foreign key and all service-layer queries filter by it (row-level
multi-tenancy). Swap SQLite for Postgres in production via DATABASE_URL —
nothing else changes.
"""
from datetime import datetime, timezone

from sqlalchemy import JSON, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    display_name: Mapped[str] = mapped_column(String(120), default="")
    plan: Mapped[str] = mapped_column(String(32), default="none")  # none|starter|growth|scale
    plan_status: Mapped[str] = mapped_column(String(32), default="inactive")  # active|past_due|inactive
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    agents: Mapped[list["Agent"]] = relationship(back_populates="owner")

    @property
    def has_active_subscription(self) -> bool:
        return self.plan_status == "active" and self.plan != "none"


class Agent(Base):
    __tablename__ = "agents"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    slug: Mapped[str] = mapped_column(String(64))          # atlas, orion, ...
    name: Mapped[str] = mapped_column(String(120))
    role: Mapped[str] = mapped_column(String(255))
    status: Mapped[str] = mapped_column(String(32), default="active")  # active|thinking|paused
    model: Mapped[str] = mapped_column(String(64), default="claude-sonnet-5")
    namespace: Mapped[str] = mapped_column(String(64))      # vector namespace this agent writes to
    tasks_completed: Mapped[int] = mapped_column(Integer, default=0)
    tokens_used: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    owner: Mapped[User] = relationship(back_populates="agents")


class MemoryEntry(Base):
    """Long-term memory record. The embedding lives in Qdrant; this row is
    the source of truth for the text + metadata (Qdrant point id == id)."""

    __tablename__ = "memory_entries"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    namespace: Mapped[str] = mapped_column(String(64), index=True)
    text: Mapped[str] = mapped_column(Text)
    source_agent: Mapped[str] = mapped_column(String(64), default="")
    importance: Mapped[float] = mapped_column(Float, default=0.5)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class TaskRun(Base):
    """Audit log of every agent task execution — powers the Live Activity
    feed and gives ops a full trace of what agents did and spent."""

    __tablename__ = "task_runs"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    agent_slug: Mapped[str] = mapped_column(String(64))
    task: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(32), default="running")  # running|completed|failed
    result: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    tokens_in: Mapped[int] = mapped_column(Integer, default=0)
    tokens_out: Mapped[int] = mapped_column(Integer, default=0)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    finished_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
