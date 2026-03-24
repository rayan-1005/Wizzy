import { Router } from 'express';
import { goalController } from '../controllers/goalController';
import { protect } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/requestValidator';
import { createGoalSchema, updateGoalSchema } from '../utils/validators';

const router = Router();
router.use(protect);

router.post('/', validateRequest(createGoalSchema), goalController.create);
router.get('/', goalController.list);
router.patch('/:id', validateRequest(updateGoalSchema), goalController.update);
router.delete('/:id', goalController.delete);

export default router;
