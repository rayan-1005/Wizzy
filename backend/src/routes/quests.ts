import { Router } from 'express';
import { questController } from '../controllers/questController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();
router.use(protect);

router.get('/today', questController.getToday);
router.get('/history', questController.getHistory);
router.patch('/:id/complete', questController.complete);

export default router;
