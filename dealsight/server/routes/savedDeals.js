import { Router } from 'express';
import { createDeal, listDeals, updateDealStatus } from '../controllers/dealsController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireFields } from '../middleware/validation.js';

const router = Router();

router.use(requireAuth);

router.get('/', listDeals);
router.post('/', requireFields(['title']), createDeal);
router.patch('/:id/status', requireFields(['status']), updateDealStatus);

export default router;
