import { Router } from 'express';
import { bossController } from '../controllers/bossController';
import { protect } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/requestValidator';
import { updateBossHealthSchema } from '../utils/validators';

const router = Router();
router.use(protect);

router.get('/', bossController.getActive);
router.patch('/:id/health', validateRequest(updateBossHealthSchema), bossController.updateHealth);

export default router;
