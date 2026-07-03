"""Blueman API server.

Run locally:
    cd backend
    pip install -r requirements.txt
    cp .env.example .env   # fill in keys
    uvicorn app.main:app --reload --port 8000

The frontend dev server (vite.config.js) already proxies /v1, /api and
/health to port 8000, so `npm run dev` + this server = full live product.
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.api.routes import router
from app.core.config import get_settings
from app.core.logging import RequestContextMiddleware, configure_logging, log
from app.db.session import init_db

settings = get_settings()
limiter = Limiter(key_func=get_remote_address, default_limits=[settings.rate_limit])


@asynccontextmanager
async def lifespan(app: FastAPI):
    configure_logging(settings.is_production)
    init_db()
    log.info("blueman_started", env=settings.env)
    yield
    log.info("blueman_stopped")


app = FastAPI(
    title="Blueman API",
    version="1.0.0",
    lifespan=lifespan,
    # Hide interactive docs in production; they leak the API surface.
    docs_url=None if settings.is_production else "/docs",
    redoc_url=None,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(RequestContextMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response


app.include_router(router)
