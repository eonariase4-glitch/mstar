import cors from 'cors';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import aiRoutes from './routes/ai.js';
import comparablesRoutes from './routes/comparables.js';
import refurbRoutes from './routes/refurb.js';
import savedDealsRoutes from './routes/savedDeals.js';
import searchRoutes from './routes/search.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isAllowedOrigin = (origin) => {
  if (!origin || origin === 'null' || origin.startsWith('file://')) return true;
  if (origin === process.env.CLIENT_ORIGIN) return true;

  try {
    const { hostname } = new URL(origin);
    return hostname === 'localhost' || hostname === '127.0.0.1';
  } catch {
    return false;
  }
};

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin(origin, callback) {
        callback(isAllowedOrigin(origin) ? null : new Error(`Origin not allowed: ${origin}`), true);
      },
    }),
  );
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'dealsight-api' });
  });

  app.use('/api/scrape', searchRoutes);
  app.use('/api/comparables', comparablesRoutes);
  app.use('/api/deals', savedDealsRoutes);
  app.use('/api/refurb', refurbRoutes);
  app.use('/api/ai', aiRoutes);

  if (process.env.SERVE_CLIENT === '1') {
    const clientDist = process.env.CLIENT_DIST || path.resolve(__dirname, '../client/dist');
    app.use(express.static(clientDist));
    app.get(/^(?!\/api).*/, (_req, res) => {
      res.sendFile(path.join(clientDist, 'index.html'));
    });
  }

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(err.status || 500).json({
      error: err.message || 'Internal server error',
    });
  });

  return app;
};
