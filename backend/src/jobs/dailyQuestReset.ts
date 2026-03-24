import { prisma } from '../config/database';
import { gamificationService } from '../services/gamificationService';
import { logger } from '../utils/logger';

/**
 * Runs nightly at midnight.
 * Expires any unfinished quests and assigns fresh ones to all users.
 */
export const runDailyQuestReset = async (): Promise<void> => {
  logger.info('⚙️  Daily quest reset started');
  const now = new Date();

  // Mark expired quests
  const expired = await prisma.quest.updateMany({
    where: { completed: false, expiresAt: { lte: now } },
    data: {},
  });
  logger.info(`Expired ${expired.count} unfinished quests`);

  // Assign fresh quests to all users
  const users = await prisma.user.findMany({ select: { id: true } });
  let assigned = 0;
  for (const user of users) {
    try {
      await gamificationService.assignDailyQuests(user.id);
      assigned++;
    } catch (err) {
      logger.error('Failed to assign quests for user', { userId: user.id, error: err });
    }
  }

  logger.info(`✅ Daily quest reset complete — assigned quests for ${assigned}/${users.length} users`);
};
