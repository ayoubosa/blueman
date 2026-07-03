"""Memory core — short-term and long-term memory for every user.

Short-term: an in-process rolling window of recent conversation turns per
user (fast, ephemeral, reset on restart — move to Redis for multi-replica).

Long-term: durable facts stored in SQL (source of truth) + Qdrant
(semantic index). Writing goes to both; reading is semantic search.
"""
from collections import defaultdict, deque

import structlog
from sqlalchemy.orm import Session

from app.db.models import MemoryEntry
from app.services.embeddings import embed_query, embed_texts
from app.services.vectorstore import vector_store

log = structlog.get_logger()

SHORT_TERM_WINDOW = 20


class MemoryCore:
    def __init__(self) -> None:
        self._short_term: dict[int, deque[dict]] = defaultdict(lambda: deque(maxlen=SHORT_TERM_WINDOW))

    # ---- short-term ----------------------------------------------------
    def remember_turn(self, user_id: int, role: str, content: str) -> None:
        self._short_term[user_id].append({"role": role, "content": content})

    def recent_turns(self, user_id: int) -> list[dict]:
        return list(self._short_term[user_id])

    # ---- long-term -----------------------------------------------------
    async def store(
        self,
        db: Session,
        user_id: int,
        text: str,
        namespace: str,
        source_agent: str = "",
        importance: float = 0.5,
    ) -> MemoryEntry:
        entry = MemoryEntry(
            user_id=user_id,
            namespace=namespace,
            text=text,
            source_agent=source_agent,
            importance=importance,
        )
        db.add(entry)
        db.commit()

        # SQL is the source of truth; the vector index is derived. If Qdrant is
        # unreachable, keep the record and log — a reindex job can backfill.
        try:
            vector = (await embed_texts([text]))[0]
            await vector_store.upsert(user_id, vector, text, namespace, source_agent)
        except Exception as exc:
            log.warning("memory_vector_index_failed", entry_id=entry.id, error=str(exc))
        log.info("memory_stored", namespace=namespace, agent=source_agent)
        return entry

    async def recall(
        self, user_id: int, query: str, limit: int = 8, namespace: str | None = None
    ) -> list[dict]:
        vector = await embed_query(query)
        return await vector_store.search(user_id, vector, limit=limit, namespace=namespace)


memory_core = MemoryCore()
