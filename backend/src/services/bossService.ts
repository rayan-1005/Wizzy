import prisma from '../config/database';
import { AppError } from '../middlewares/errorHandler';
import { ERRORS, BOSS_NAMES, XP_REWARDS } from '../utils/constants';
import { emitToUser } from '../config/socket';
import { gamificationService } from './gamificationService';
import { logger } from '../utils/logger';

export const bossService = {
  async getActive(userId: string) {
    return prisma.bossBattle.findMany({
      where: { userId, status: { in: ['ACTIVE', 'WEAKENING'] } },
      orderBy: { detectedAt: 'desc' },
    });
  },

  async updateHealth(userId: string, bossId: string, reduction: number) {
    const boss = await prisma.bossBattle.findFirst({
      where: { id: bossId, userId, status: { not: 'DEFEATED' } },
    });
    if (!boss) throw new AppError(ERRORS.NOT_FOUND, 404);

    const newHealth = Math.max(0, boss.healthPercent - reduction);
    const newStatus = newHealth === 0 ? 'DEFEATED' : newHealth < 30 ? 'WEAKENING' : 'ACTIVE';

    const updated = await prisma.bossBattle.update({
      where: { id: bossId },
      data: {
        healthPercent: newHealth,
        status: newStatus,
        defeatedAt: newStatus === 'DEFEATED' ? new Date() : null,
      },
    });

    if (newStatus === 'DEFEATED') {
      await gamificationService.awardXP(userId, XP_REWARDS.BOSS_DEFEATED);
      await prisma.progression.update({
        where: { userId },
        data: { bossesDefeated: { increment: 1 } },
      });
      emitToUser(userId, 'boss-defeated', {
        bossId, bossName: boss.name, xpEarned: XP_REWARDS.BOSS_DEFEATED,
      });
      logger.info('Boss defeated', { userId, bossId, bossName: boss.name });
    }

    return updated;
  },

  // Called by spending analysis job when anomaly detected
  async spawnBoss(userId: string, category: string, anomalyAmount: number) {
    const existing = await prisma.bossBattle.findFirst({
      where: { userId, category, status: { not: 'DEFEATED' } },
    });
    if (existing) return existing; // Don't spawn duplicate

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const boss = await prisma.bossBattle.create({
      data: {
        userId,
        name: BOSS_NAMES[category] ?? 'The Spending Specter',
        description: `Your ${category} spending is unusually high this month!`,
        category,
        anomalyAmount,
        expiresAt,
      },
    });

    emitToUser(userId, 'boss-detected', boss);
    logger.info('Boss spawned', { userId, bossId: boss.id, category, anomalyAmount });
    return boss;
  },
};
