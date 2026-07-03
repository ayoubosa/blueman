# Blueman Backend

Production-grade FastAPI server powering the Blueman AI Operating System.

## Architecture

```
app/
├── main.py            # App factory: CORS, rate limiting, security headers, lifespan
├── schemas.py         # Pydantic request/response contracts
├── core/
│   ├── config.py      # Env-driven settings (BLUEMAN_* vars)
│   ├── logging.py     # Structured JSON logs + per-request correlation IDs
│   └── security.py    # bcrypt password hashing + JWT sessions
├── api/
│   ├── deps.py        # DB session, current-user, paying-customer gate
│   └── routes.py      # All public endpoints (paths match the frontend's api.js)
├── db/
│   ├── models.py      # Users, Agents, MemoryEntries, TaskRuns (multi-tenant)
│   └── session.py     # Engine + session management
└── services/
    ├── llm.py         # Claude client (single provider seam)
    ├── embeddings.py  # Text → vector (swap for Voyage/OpenAI here only)
    ├── vectorstore.py # Qdrant: one collection per tenant, namespace filters
    ├── memory.py      # Memory core: short-term window + long-term SQL+Qdrant
    ├── rag.py         # Retrieve → compose → reason pipeline
    ├── brain.py       # Plan → Retrieve → Reason → Act loop
    └── orchestrator.py# Agent fleet: provision, dispatch, execute, persist
```

## The intelligence loop

1. **Brain** routes each request: direct answer vs delegate to a specialist agent.
2. **RAG** grounds every answer in the tenant's own data (Qdrant semantic recall).
3. **Orchestrator** executes delegated tasks async and writes results back into
   long-term memory — so the system gets smarter about each business over time.

## Security & multi-tenancy

- All product routes require a JWT **and** an active subscription
  (`get_paying_user` returns 402 otherwise). Non-paying users only reach
  `/health` and the auth routes — the platform itself is locked.
- One Qdrant collection per tenant: cross-tenant retrieval is structurally impossible.
- bcrypt password hashing, security headers, per-IP rate limiting, non-root Docker user.
- Structured logs with request IDs — ready for Datadog/Loki/CloudWatch.

## Run locally

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # add your ANTHROPIC_API_KEY
docker run -p 6333:6333 qdrant/qdrant   # vector DB
uvicorn app.main:app --reload --port 8000
```

Then `npm run dev` in the repo root — the Vite proxy points at :8000 and the
UI switches from demo mode to live automatically.

## Deploy

```bash
docker build -t blueman-api backend/
docker run -p 8000:8000 --env-file backend/.env blueman-api
```

Works on Fly.io, Railway, Render, or any container host. Use managed
Postgres (`BLUEMAN_DATABASE_URL`) and Qdrant Cloud in production.

## Scaling path

| Concern | Now | At scale |
|---------|-----|----------|
| DB | SQLite | Postgres (change env var only) |
| Short-term memory | in-process | Redis |
| Task execution | asyncio | Celery/Arq workers |
| Embeddings | local hash projection | Voyage / OpenAI embeddings |
| Rate limiting | per-IP in-process | API gateway |
