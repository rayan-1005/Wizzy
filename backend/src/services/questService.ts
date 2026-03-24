import prisma from '../config/database';
import { gamificationService } from './gamificationService';

export const questService = {
  async getToday(userId: string) {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    let quests = await prisma.quest.findMany({
      where: { userId, assignedAt: { gte: startOfDay }, expiresAt: { gt: now } },
      orderBy: { assignedAt: 'desc' },
    });

    // Auto-assign if none exist yet for today
    if (quests.length === 0) {
      await gamificationService.assignDailyQuests(userId);
      quests = await prisma.quest.findMany({
        where: { userId, assignedAt: { gte: startOfDay }, expiresAt: { gt: now } },
      });
    }

    return quests;
  },

  async complete(userId: string, questId: string) {
    const quest = await prisma.quest.findFirst({
      where: { id: questId, userId, completed: false },
    });
    if (!quest) return null;

    const updated = await prisma.quest.update({
      where: { id: questId },
      data: { completed: true, completedAt: new Date() },
    });

    await gamificationService.awardXP(userId, quest.xpReward);
    await gamificationService.updateStreak(userId);
    await prisma.progression.update({
      where: { userId },
      data: { totalQuestsCompleted: { increment: 1 } },
    });

    return updated;
  },

  async getHistory(userId: string) {
    return prisma.quest.findMany({
      where: { userId, completed: true },
      orderBy: { completedAt: 'desc' },
      take: 50,
    });
  },
};
