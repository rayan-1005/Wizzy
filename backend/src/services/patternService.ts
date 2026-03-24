import prisma from '../config/database';
import { bossService } from './bossService';
import { logger } from '../utils/logger';

const ANOMALY_THRESHOLD = 0.5; // 50% above average = anomaly

export const patternService = {
  async analyzeUser(userId: string): Promise<void> {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [currentTransactions, lastMonthTransactions] = await Promise.all([
      prisma.transaction.findMany({ where: { userId, date: { gte: startOfMonth } } }),
      prisma.transaction.findMany({ where: { userId, date: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
    ]);

    const categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Other'];

    for (const category of categories) {
      const current = currentTransactions.filter((t) => t.category === category);
      const last = lastMonthTransactions.filter((t) => t.category === category);

      const totalAmount = current.reduce((s, t) => s + t.amount, 0);
      const lastTotal = last.reduce((s, t) => s + t.amount, 0);
      const daysPassed = Math.max(1, now.getDate());
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const projectedTotal = (totalAmount / daysPassed) * daysInMonth;

      const averageDailyAmount = Math.round(totalAmount / daysPassed);
      const monthOverMonthChange = lastTotal > 0
        ? ((totalAmount - lastTotal) / lastTotal) * 100
        : null;

      const isAnomaly = lastTotal > 0 && projectedTotal > lastTotal * (1 + ANOMALY_THRESHOLD);
      const anomalyReason = isAnomaly
        ? `Projected to spend ${Math.round(((projectedTotal - lastTotal) / lastTotal) * 100)}% more than last month`
        : null;

      await prisma.spendingPattern.upsert({
        where: { userId_category_month: { userId, category, month: currentMonth } },
        create: {
          userId, category, month: currentMonth,
          totalAmount, averageDailyAmount,
          monthOverMonthChange, isAnomaly, anomalyReason,
        },
        update: {
          totalAmount, averageDailyAmount,
          monthOverMonthChange, isAnomaly, anomalyReason,
          analyzedAt: new Date(),
        },
      });

      if (isAnomaly && totalAmount > 0) {
        await bossService.spawnBoss(userId, category, totalAmount);
      }
    }

    logger.info('Spending analysis complete', { userId, month: currentMonth });
  },

  async analyzeAllUsers(): Promise<void> {
    const users = await prisma.user.findMany({ select: { id: true } });
    logger.info(`Running spending analysis for ${users.length} users`);
    for (const user of users) {
      try {
        await this.analyzeUser(user.id);
      } catch (err) {
        logger.error('Analysis failed for user', { userId: user.id, error: err });
      }
    }
  },
};
