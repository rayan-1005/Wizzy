import { Router } from 'express';
import { userController } from '../controllers/userController';
import { protect } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/requestValidator';
import { updateUserSchema } from '../utils/validators';

const router = Router();
router.use(protect);

router.get('/profile', userController.getProfile);
router.patch('/profile', validateRequest(updateUserSchema), userController.updateProfile);

export default router;
