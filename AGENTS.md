# AGENTS.md

The product lives in `dealsight/` (npm workspaces: `client`, `server`). It is **DealSight**, a UK property
investment web app: a React/Vite/Tailwind client (port 5173) and an Express/PostgreSQL API (port 5000).
It can also be packaged as a downloadable Electron desktop app.

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
- Dev DB: role `user` / password `password`, database `dealsight`, matching
  `DATABASE_URL=postgres://user:password@localhost:5432/dealsight` in `dealsight/.env`.
- `dealsight/.env` is local-only (gitignored). If missing, recreate it from `dealsight/.env.example`.
- The server boots even if Postgres is down; deal endpoints only fail at query time.

### Desktop app (Electron)
- Packaging lives in `dealsight/desktop/main.cjs` with electron-builder config in `dealsight/package.json`
  (`build` field). Commands (from `dealsight/`): `npm run desktop` (run locally), `npm run dist` (build
  installer), `npm run dist:dir` (unpacked only).
- `desktop/main.cjs` boots the **bundled** Express API in-process (sets `SERVE_CLIENT=1`, `CLIENT_DIST`, `PORT`,
  and a default local `DATABASE_URL`), polls `/api/health`, then opens the window on `http://localhost:<PORT>`.
- The server only serves the static client when `SERVE_CLIENT=1`; normal `npm run dev` is unchanged.
- The desktop port is overridable via `DEALSIGHT_PORT` (defaults to `PORT` or 5000) — useful to avoid clashing
  with a running dev server.
- electron-builder needs the server's runtime deps resolvable from the **root** package, so they are duplicated
  in the root `dependencies` (they hoist to the same `node_modules`). Build output goes to `release/` (gitignored).
- Puppeteer's Chromium is not bundled; the optional Rightmove scraper is the only feature that needs it.
- In containers, run Electron/AppImage with `--no-sandbox` (and AppImage with `--appimage-extract-and-run` when
  FUSE is unavailable).

### Known caveat
- `database/002_seed_deals.sql` fails on the `deals` insert (`jsonb` vs `text` in the `UNION ALL` SELECT), so the
  Deal Board starts empty server-side. The schema (`001_schema.sql`) and the create-deal API both work; create
  deals via `POST /api/deals` instead of relying on the seed. (Note: the current `DealBoard.jsx` renders local
  demo cards and does not yet read `/api/deals`.)

### Lint / Test / Build
- **No lint or test tooling is configured** (no ESLint/Prettier, no test runner).
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
  SPARQL API (no key; returns empty without outbound network). Sourcing uses Puppeteer/Chromium scraping.
  SPARQL API (no key). Sourcing uses Puppeteer/Chromium scraping. None are needed for the core app to run.
