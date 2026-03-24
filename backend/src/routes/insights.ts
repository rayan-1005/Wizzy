import { Router } from 'express';
import { insightController } from '../controllers/insightController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();
router.use(protect);

router.get('/dashboard', insightController.getDashboard);
router.get('/categories', insightController.getCategories);
router.get('/trends', insightController.getTrends);
router.get('/anomalies', insightController.getAnomalies);
router.get('/coaching', insightController.getCoaching);

export default router;
