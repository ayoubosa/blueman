"""Claude client wrapper.

Single place that talks to the Anthropic API. Everything above this layer
(RAG, brain, agents) passes plain message lists and gets text back, so the
model/provider can be swapped without touching business logic.
"""
from collections.abc import AsyncIterator

import anthropic
import structlog

from app.core.config import get_settings

log = structlog.get_logger()


class LLMClient:
    def __init__(self) -> None:
        settings = get_settings()
        self._model = settings.anthropic_model
        self._client = (
            anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)
            if settings.anthropic_api_key
            else None
        )

    @property
    def available(self) -> bool:
        return self._client is not None

    async def complete(
        self,
        messages: list[dict],
        system: str = "",
        max_tokens: int = 1024,
        temperature: float = 0.7,
    ) -> tuple[str, int, int]:
        """Non-streaming completion. Returns (text, tokens_in, tokens_out)."""
        if not self._client:
            raise RuntimeError("ANTHROPIC_API_KEY not configured")
        resp = await self._client.messages.create(
            model=self._model,
            system=system or anthropic.NOT_GIVEN,
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature,
        )
        text = "".join(b.text for b in resp.content if b.type == "text")
        return text, resp.usage.input_tokens, resp.usage.output_tokens

    async def stream(
        self,
        messages: list[dict],
        system: str = "",
        max_tokens: int = 1024,
        temperature: float = 0.7,
    ) -> AsyncIterator[str]:
        """Streaming completion — yields text deltas."""
        if not self._client:
            raise RuntimeError("ANTHROPIC_API_KEY not configured")
        async with self._client.messages.stream(
            model=self._model,
            system=system or anthropic.NOT_GIVEN,
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature,
        ) as stream:
            async for delta in stream.text_stream:
                yield delta


llm = LLMClient()
