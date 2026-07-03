"""Qdrant vector store — the retrieval half of the RAG system.

One collection per user keeps tenants fully isolated; namespaces
(market/sales/content/analysis/comms/knowledge) are payload filters
inside the collection so cross-namespace queries stay cheap.
"""
import uuid

import structlog
from qdrant_client import AsyncQdrantClient, models

from app.core.config import get_settings

log = structlog.get_logger()


class VectorStore:
    def __init__(self) -> None:
        settings = get_settings()
        self._dim = settings.embedding_dim
        self._client = AsyncQdrantClient(
            url=settings.qdrant_url,
            api_key=settings.qdrant_api_key or None,
        )

    @staticmethod
    def _collection(user_id: int) -> str:
        return f"blueman_user_{user_id}"

    async def ensure_collection(self, user_id: int) -> None:
        name = self._collection(user_id)
        if not await self._client.collection_exists(name):
            await self._client.create_collection(
                collection_name=name,
                vectors_config=models.VectorParams(size=self._dim, distance=models.Distance.COSINE),
            )
            # Index the namespace field so filtered searches stay fast at scale.
            await self._client.create_payload_index(
                collection_name=name,
                field_name="namespace",
                field_schema=models.PayloadSchemaType.KEYWORD,
            )

    async def upsert(
        self, user_id: int, vector: list[float], text: str, namespace: str, source_agent: str = ""
    ) -> str:
        await self.ensure_collection(user_id)
        point_id = uuid.uuid4().hex
        await self._client.upsert(
            collection_name=self._collection(user_id),
            points=[
                models.PointStruct(
                    id=point_id,
                    vector=vector,
                    payload={"text": text, "namespace": namespace, "source_agent": source_agent},
                )
            ],
        )
        return point_id

    async def search(
        self,
        user_id: int,
        vector: list[float],
        limit: int = 8,
        namespace: str | None = None,
    ) -> list[dict]:
        """Return [{text, namespace, source_agent, score}] best-first."""
        query_filter = None
        if namespace:
            query_filter = models.Filter(
                must=[models.FieldCondition(key="namespace", match=models.MatchValue(value=namespace))]
            )
        try:
            hits = await self._client.search(
                collection_name=self._collection(user_id),
                query_vector=vector,
                limit=limit,
                query_filter=query_filter,
            )
        except Exception as exc:  # collection missing / Qdrant down → degrade gracefully
            log.warning("vector_search_failed", error=str(exc))
            return []
        return [{**(h.payload or {}), "score": h.score} for h in hits]


vector_store = VectorStore()
