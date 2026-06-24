# AGENTS.md

The product lives in `dealsight/` (npm workspaces: `client`, `server`). It is **DealSight**, a UK property
investment web app: a React/Vite/Tailwind client (port 5173) and an Express/PostgreSQL API (port 5000).

## Cursor Cloud specific instructions

Standard commands live in `dealsight/README.md` and the workspace `package.json` scripts. Notes that are
not obvious from those files:

### Services
- **API (Express)** — port `5000`. Run with `npm run dev --workspace server` (nodemon) from `dealsight/`.
- **Client (Vite)** — port `5173`, binds `0.0.0.0`. Vite proxies `/api` → `http://localhost:5000`.
- `npm run dev` (from `dealsight/`) starts **both** via a bare `&`, so both share one terminal; logs interleave.
- Health check: `curl http://localhost:5000/api/health`.

### PostgreSQL (required for the Deal Board / `/api/deals`)
- PostgreSQL is installed but **not auto-started**. Start it each session before running the API:
  `sudo pg_ctlcluster 16 main start`
- The dev DB role/database already exist in the snapshot: role `user` / password `password`, database `dealsight`,
  matching `DATABASE_URL=postgres://user:password@localhost:5432/dealsight` in `dealsight/.env`.
- `dealsight/.env` is local-only (gitignored). If missing, recreate it from `dealsight/.env.example` and set
  the `DATABASE_URL` above.
- The server boots even if Postgres is down; deal endpoints only fail at query time, so verify Postgres is running
  when `/api/deals` errors.

### Known caveat
- `database/002_seed_deals.sql` fails on the `deals` insert (`jsonb` vs `text` in the `UNION ALL` SELECT), so the
  Deal Board starts empty. The schema (`001_schema.sql`) and the create-deal API both work; create deals via the
  app or `POST /api/deals` instead of relying on the seed.

### Lint / Test / Build
- **No lint or test tooling is configured** (no ESLint/Prettier, no test runner). There is nothing to run.
- Build the client with `npm run build` (from `dealsight/`) → outputs `client/dist`.

### External integrations (all optional, degrade gracefully)
- Refurb Estimator needs `OPENAI_API_KEY` (returns 503 if unset). Comparables use the public UK Land Registry
  SPARQL API (no key). Sourcing uses Puppeteer/Chromium scraping. None are needed for the core app to run.
