import { Router } from 'express';

const router = Router();

router.get('/status', (_req, res) => {
  res.json({
    configured: Boolean(process.env.OPENAI_API_KEY),
  });
});

export default router;
