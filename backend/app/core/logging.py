"""Structured JSON logging via structlog.

Every request gets a request_id bound to the logger so log lines from a
single request can be correlated in any log aggregator (Datadog, Loki, ...).
"""
import logging
import sys
import uuid

import structlog
from starlette.middleware.base import BaseHTTPMiddleware


def configure_logging(is_production: bool) -> None:
    processors = [
        structlog.contextvars.merge_contextvars,
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
    ]
    if is_production:
        processors.append(structlog.processors.JSONRenderer())
    else:
        processors.append(structlog.dev.ConsoleRenderer())

    structlog.configure(
        processors=processors,
        wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
        logger_factory=structlog.PrintLoggerFactory(sys.stdout),
    )


class RequestContextMiddleware(BaseHTTPMiddleware):
    """Bind a unique request_id (and path) to every log line of a request."""

    async def dispatch(self, request, call_next):
        structlog.contextvars.clear_contextvars()
        structlog.contextvars.bind_contextvars(
            request_id=uuid.uuid4().hex[:12],
            path=request.url.path,
            method=request.method,
        )
        response = await call_next(request)
        return response


log = structlog.get_logger()
