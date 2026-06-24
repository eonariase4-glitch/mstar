import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import aiRoutes from './routes/ai.js';
import comparablesRoutes from './routes/comparables.js';
import refurbRoutes from './routes/refurb.js';
import savedDealsRoutes from './routes/savedDeals.js';
import searchRoutes from './routes/search.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
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

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

app.listen(port, () => {
  console.log(`DealSight API listening on port ${port}`);
});
