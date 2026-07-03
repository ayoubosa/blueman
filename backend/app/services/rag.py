"""RAG pipeline — retrieval-augmented generation over the user's business data.

Flow per query:
  1. Recall: semantic search over the user's long-term memory (Qdrant).
  2. Compose: build a grounded system prompt with the retrieved context.
  3. Reason: Claude answers using ONLY that context + conversation history.

Every answer is grounded in the tenant's own data — no cross-tenant leakage
is possible because retrieval is scoped to the user's collection.
"""
import structlog

from app.services.llm import llm
from app.services.memory import memory_core

log = structlog.get_logger()

SYSTEM_TEMPLATE = """You are Blueman, the AI operating system running {display_name}'s online business.
You orchestrate a fleet of specialist agents (Atlas: market research, Orion: sales,
Lyra: content, Vega: analytics, Nova: inbox, Sol: scheduling).

Answer using the business context below. Be concise, concrete and numbers-first.
If the context doesn't contain the answer, say so and offer to task an agent with finding it.

## Business context (retrieved from memory)
{context}
"""


def _format_context(chunks: list[dict]) -> str:
    if not chunks:
        return "(no relevant records found)"
    lines = []
    for c in chunks:
        src = f" — {c.get('source_agent')}" if c.get("source_agent") else ""
        lines.append(f"- [{c.get('namespace', '?')}{src}] {c.get('text', '')}")
    return "\n".join(lines)


class RAGPipeline:
    async def answer(
        self,
        user_id: int,
        display_name: str,
        messages: list[dict],
        max_tokens: int = 1024,
        temperature: float = 0.7,
    ) -> tuple[str, int, int]:
        """Answer the latest user message with retrieved context.

        Returns (text, tokens_in, tokens_out).
        """
        query = next((m["content"] for m in reversed(messages) if m["role"] == "user"), "")
        chunks = await memory_core.recall(user_id, query, limit=8)
        log.info("rag_retrieved", chunks=len(chunks))

        system = SYSTEM_TEMPLATE.format(
            display_name=display_name or "the owner",
            context=_format_context(chunks),
        )
        text, tin, tout = await llm.complete(
            messages, system=system, max_tokens=max_tokens, temperature=temperature
        )

        # Feed the exchange back into short-term memory for continuity.
        memory_core.remember_turn(user_id, "user", query)
        memory_core.remember_turn(user_id, "assistant", text)
        return text, tin, tout


rag = RAGPipeline()
