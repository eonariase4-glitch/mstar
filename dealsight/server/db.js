import pg from 'pg';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

// Managed Postgres providers (Supabase, Render, Neon, RDS, ...) require TLS.
// Enable SSL automatically for any non-local connection so the same code runs
// unchanged in local dev (plain) and in the cloud (TLS). Set PGSSL=disable to
// force it off if you ever point DATABASE_URL at a remote server without TLS.
const isLocal = !connectionString || /@(localhost|127\.0\.0\.1)[:/]/.test(connectionString);
const useSsl = !isLocal && process.env.PGSSL !== 'disable';

export const pool = new Pool({
  connectionString,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
});

export const query = (text, params) => pool.query(text, params);
