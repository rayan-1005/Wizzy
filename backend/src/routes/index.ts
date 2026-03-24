import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './user';
import expenseRoutes from './expenses';
import goalRoutes from './goals';
import questRoutes from './quests';
import bossRoutes from './bosses';
import insightRoutes from './insights';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/expenses', expenseRoutes);
router.use('/goals', goalRoutes);
router.use('/quests', questRoutes);
router.use('/bosses', bossRoutes);
router.use('/insights', insightRoutes);

// Health check
router.get('/health', (_req, res) => {
  res.status(200).json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
