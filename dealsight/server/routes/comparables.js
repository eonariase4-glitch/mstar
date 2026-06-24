import { Router } from 'express';
import { calculateCompsMetrics, fetchSoldData } from '../services/comparableService.js';

const router = Router();

router.get('/:postcode', async (req, res, next) => {
  try {
    const data = await fetchSoldData(req.params.postcode);
    res.json({
      data,
      metrics: calculateCompsMetrics(data),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
