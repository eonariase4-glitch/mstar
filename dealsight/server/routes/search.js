import { Router } from 'express';
import { searchRightmove } from '../controllers/searchController.js';
import { requireFields } from '../middleware/validation.js';

const router = Router();

router.post('/rightmove', requireFields(['location']), searchRightmove);

export default router;
