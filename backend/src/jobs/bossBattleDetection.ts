import prisma from '../config/database';
import { logger } from '../utils/logger';

/**
 * Runs daily.
 * Expires boss battles that have passed their 30-day window without being defeated.
 */
export const runBossBattleDetection = async (): Promise<void> => {
  logger.info('⚙️  Boss battle cleanup started');

  const expired = await prisma.bossBattle.updateMany({
    where: { status: { not: 'DEFEATED' }, expiresAt: { lte: new Date() } },
    data: { status: 'DEFEATED', defeatedAt: new Date() },
  });

  logger.info(`✅ Expired ${expired.count} undefeated boss battles`);
};
