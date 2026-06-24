import { Router } from 'express';
import { requireFields } from '../middleware/validation.js';
import { parseRefurbScope } from '../services/openaiService.js';

const router = Router();

router.post('/parse-scope', requireFields(['text', 'sqft']), async (req, res, next) => {
  try {
    const result = await parseRefurbScope(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
