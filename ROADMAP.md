# Blueman Roadmap — Accelerated Schedule

> **Cadence changed: 1 phase per DAY (was 1 per week).**
> Each day ships something usable. Quality bar stays production-level.

## Day-by-day plan

| Day | Phase | Deliverable | Status |
|-----|-------|-------------|--------|
| **Day 1** | Foundation | Backend scaffold: FastAPI, auth (JWT + subscription gate), DB models, structured logging, rate limiting, Docker. Locked customer access on the frontend. | ✅ Done |
| **Day 2** | Intelligence core | RAG pipeline (Qdrant + Claude), memory core (short/long-term), brain reasoning loop, agent orchestrator. | ✅ Done (code) — deploy + wire real keys |
| **Day 3** | Landing & positioning | Growth stats, trust indicators, testimonials, case studies, Swiss swipe gallery, guided-demo workflow below trust. | ✅ Done |
| **Day 4** | Deploy the backend | Host API (Fly.io/Railway) + Qdrant Cloud + Postgres. Point Vercel frontend at it. First real end-to-end chat. | ⬜ |
| **Day 5** | Ingestion #1 — Gmail | OAuth flow, pull last 30 days, chunk → embed → store per namespace. Digest becomes real. | ⬜ |
| **Day 6** | Ingestion #2 — Shopify + Stripe | Orders/revenue into `analysis` namespace. Vega answers real revenue questions. | ⬜ |
| **Day 7** | Billing | Stripe Checkout + webhooks → `plan_status` flips to active automatically. Customers self-serve. | ⬜ |
| **Day 8** | Live activity | WebSocket feed of TaskRuns → dashboard activity becomes real-time. | ⬜ |
| **Day 9** | Notifications | Email (and later WhatsApp) alerts when agents finish work or find anomalies. | ⬜ |
| **Day 10** | Agent builder | Create custom agents from the UI: name, role, namespace, schedule. | ⬜ |
| **Day 11** | Automations engine | Cron + trigger execution of flows, run history persisted. | ⬜ |
| **Day 12** | Hardening | Real embeddings (Voyage), Redis short-term memory, worker queue, monitoring dashboards, load test. | ⬜ |

## Operating rules

1. A phase is done when it's **deployed**, not when the code compiles.
2. Anything that slips moves to the next morning — the cadence holds.
3. Architecture decisions that improve scalability/maintainability are made
   inline without waiting for approval (per project direction).
