"""Brain — the core reasoning engine.

The brain sits above the RAG pipeline and the agent fleet. For each incoming
objective it runs a Plan → Retrieve → Reason → Act loop:

  PLAN      decide whether this needs a direct answer or an agent task
  RETRIEVE  pull relevant long-term memory
  REASON    Claude produces the answer / decision with grounded context
  ACT       optionally dispatch a task to an agent via the orchestrator

Keeping this loop in one module means the "intelligence" of the product has
a single, testable entry point: Brain.think().
"""
import json

import structlog
from sqlalchemy.orm import Session

from app.services.llm import llm
from app.services.memory import memory_core
from app.services.rag import rag

log = structlog.get_logger()

ROUTER_SYSTEM = """You are the routing cortex of Blueman, an AI business operating system.
Decide how to handle the user's request. Reply with ONLY a JSON object:
{"mode": "answer"} if it can be answered directly from context, or
{"mode": "delegate", "agent": "<atlas|orion|lyra|vega|nova|sol>", "task": "<one-line task>"}
if a specialist agent should execute work asynchronously."""


class Brain:
    async def think(
        self,
        db: Session,
        user_id: int,
        display_name: str,
        messages: list[dict],
    ) -> dict:
        """Full reasoning loop. Returns
        {text, tokens_in, tokens_out, delegated: bool, agent: str|None}."""
        query = next((m["content"] for m in reversed(messages) if m["role"] == "user"), "")

        # PLAN — cheap, low-token routing decision.
        decision = {"mode": "answer"}
        try:
            raw, _, _ = await llm.complete(
                [{"role": "user", "content": query}],
                system=ROUTER_SYSTEM,
                max_tokens=100,
                temperature=0.0,
            )
            decision = json.loads(raw.strip().strip("`").removeprefix("json"))
        except Exception as exc:
            log.warning("router_fallback", error=str(exc))

        # ACT — dispatch to an agent when the router says so.
        delegated, agent_slug = False, None
        if decision.get("mode") == "delegate":
            from app.services.orchestrator import orchestrator  # avoid circular import

            agent_slug = decision.get("agent", "atlas")
            await orchestrator.dispatch(db, user_id, agent_slug, decision.get("task", query))
            delegated = True

        # RETRIEVE + REASON — grounded answer either way, so the user always
        # gets an immediate response even when work was delegated.
        text, tin, tout = await rag.answer(user_id, display_name, messages)
        if delegated:
            text += f"\n\n_(Delegated to {agent_slug.capitalize()} — results will appear in Live Activity.)_"

        return {
            "text": text,
            "tokens_in": tin,
            "tokens_out": tout,
            "delegated": delegated,
            "agent": agent_slug,
        }


brain = Brain()
