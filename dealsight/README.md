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
