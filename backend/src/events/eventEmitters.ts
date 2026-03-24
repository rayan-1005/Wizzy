import { emitToUser } from '../config/socket';
import { logger } from '../utils/logger';

export const emitNotification = (
  userId: string,
  type: string,
  title: string,
  message: string
): void => {
  emitToUser(userId, 'notification', { type, title, message });
  logger.info('Notification emitted', { userId, type, title });
};

export const emitQuestCompleted = (
  userId: string,
  questId: string,
  xpEarned: number
): void => {
  emitToUser(userId, 'quest-completed', { questId, xpEarned });
};

export const emitLevelUp = (
  userId: string,
  oldLevel: number,
  newLevel: number,
  totalXp: number
): void => {
  emitToUser(userId, 'level-up', { oldLevel, newLevel, totalXp });
  logger.info('Level up emitted', { userId, oldLevel, newLevel });
};
