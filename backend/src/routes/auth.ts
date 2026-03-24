import { Router } from 'express';
import { authController } from '../controllers/authController';
import { validateRequest } from '../middlewares/requestValidator';
import { registerSchema, loginSchema } from '../utils/validators';
import { authLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.post('/register', authLimiter, validateRequest(registerSchema), authController.register);
router.post('/login', authLimiter, validateRequest(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);

export default router;
