# DealSight

DealSight is a UK property intelligence starter app with a React/Vite/Tailwind client,
an Express/PostgreSQL API, Land Registry comparables, Rightmove scraping stubs, and
investment calculators for BTL/BRRR workflows.

## Structure

```text
dealsight/
├── client/      # React (Vite) + Tailwind
├── server/      # Node.js + Express
├── database/    # PostgreSQL migrations and seed data
└── .env.example
```

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Run database setup from the repository root after creating a PostgreSQL database:

```bash
psql "$DATABASE_URL" -f database/001_schema.sql
psql "$DATABASE_URL" -f database/002_seed_deals.sql
```

The client expects the server at `http://localhost:5000` in development.

## Web deployment (GitHub Pages)

The repository includes a GitHub Actions workflow at `.github/workflows/deploy-web.yml`.
It deploys the Vite web client to GitHub Pages on pushes to `main` and can also be
started manually from the Actions tab.

The workflow builds the app for the repository path:

```bash
VITE_BASE_PATH=/mstar/ npm run build
```

If the static Pages app should call a deployed API, set the repository variable
`DEALSIGHT_API_BASE_URL` to that backend's `/api` URL. If it is unset, the client
uses relative `/api` calls, which is correct for local development and desktop builds.

## Desktop app (downloadable)

DealSight can be packaged as a self-contained desktop application (Electron) that bundles the
React client and the Express API into a single installable file.

```bash
# Run the desktop app locally (builds the client, then launches Electron).
npm run desktop
npm run desktop:preview

# Build downloadable artifacts into ./release.
npm run desktop:build  # Linux AppImage
npm run desktop:dir    # unpacked Linux build only
npm run dist           # platform installer
npm run dist:dir       # unpacked build only
```

`npm run dist` produces `release/DealSight-<version>.AppImage` on Linux — a single downloadable file
that launches the full app (client + API) with no separate server to start.

The desktop build starts the bundled API with `SERVE_CLIENT=1`, so the Express server also serves the
built client and all relative `/api` calls share one origin. The Deal Board still needs a reachable
`DATABASE_URL` (defaults to the local dev Postgres); all other screens work without it.
