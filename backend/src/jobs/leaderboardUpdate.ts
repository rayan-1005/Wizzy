import { prisma } from '../config/database';
import { logger } from '../utils/logger';

/**
 * Runs hourly.
 * Rebuilds the leaderboard table from progression data.
 */
export const runLeaderboardUpdate = async (): Promise<void> => {
  logger.info('⚙️  Leaderboard update started');

  const progressions = await prisma.progression.findMany({
    orderBy: [{ totalXp: 'desc' }, { level: 'desc' }],
    select: { userId: true, level: true, totalXp: true },
  });

  for (let i = 0; i < progressions.length; i++) {
    const p = progressions[i];
    await prisma.leaderboard.upsert({
      where: { userId: p.userId },
      create: { userId: p.userId, rank: i + 1, level: p.level, totalXp: p.totalXp },
      update: { rank: i + 1, level: p.level, totalXp: p.totalXp },
    });
  }

  logger.info(`✅ Leaderboard updated for ${progressions.length} users`);
};
