import prisma from '../config/database';
import { emitToUser } from '../config/socket';
import { XP_REWARDS, LEVEL_THRESHOLDS, LEVEL_TITLES, QUEST_DESCRIPTIONS } from '../utils/constants';
import { logger } from '../utils/logger';
import { QuestType } from '../types';

export const gamificationService = {
  // Award XP and check for level-up
  async awardXP(userId: string, amount: number): Promise<void> {
    const progression = await prisma.progression.upsert({
      where: { userId },
      create: { userId, totalXp: amount, totalXpEarned: amount },
      update: { totalXp: { increment: amount }, totalXpEarned: { increment: amount } },
    });

    const oldLevel = this.calculateLevel(progression.totalXp - amount);
    const newLevel = this.calculateLevel(progression.totalXp);

    if (newLevel > oldLevel) {
      await prisma.progression.update({
        where: { userId },
        data: { level: newLevel },
      });
      emitToUser(userId, 'level-up', {
        oldLevel,
        newLevel,
        totalXp: progression.totalXp,
        title: LEVEL_TITLES[newLevel] ?? `Level ${newLevel}`,
      });
      logger.info('User leveled up', { userId, oldLevel, newLevel });
    }
  },

  calculateLevel(totalXp: number): number {
    let level = 1;
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (totalXp >= LEVEL_THRESHOLDS[i]) {
        level = i + 1;
        break;
      }
    }
    return level;
  },

  // Check if a quest should be completed and award XP
  async checkQuestProgress(userId: string, questType: QuestType): Promise<void> {
    const now = new Date();
    const quest = await prisma.quest.findFirst({
      where: { userId, type: questType, completed: false, expiresAt: { gt: now } },
    });

    if (!quest) return;

    await prisma.quest.update({
      where: { id: quest.id },
      data: { completed: true, completedAt: now },
    });

    // Update progression streak
    await this.updateStreak(userId);
    await prisma.progression.update({
      where: { userId },
      data: { totalQuestsCompleted: { increment: 1 } },
    });

    await this.awardXP(userId, quest.xpReward);

    emitToUser(userId, 'quest-completed', {
      questId: quest.id,
      xpEarned: quest.xpReward,
      questType,
    });

    logger.info('Quest completed', { userId, questType, xpReward: quest.xpReward });
  },

  // Assign daily quests (called by daily reset job)
  async assignDailyQuests(userId: string): Promise<void> {
    const tomorrow = new Date();
    tomorrow.setHours(23, 59, 59, 999);

    const questTypes: QuestType[] = [
      'LOG_EXPENSE',
      'TRANSFER_SAVINGS',
      'REVIEW_CATEGORY',
      'STAY_UNDER_BUDGET',
      'ADD_GOAL',
    ];

    // Pick 3 random quests
    const shuffled = questTypes.sort(() => Math.random() - 0.5).slice(0, 3);

    await prisma.quest.createMany({
      data: shuffled.map((type) => ({
        userId,
        type,
        description: QUEST_DESCRIPTIONS[type],
        xpReward: XP_REWARDS[type as keyof typeof XP_REWARDS] ?? 10,
        expiresAt: tomorrow,
      })),
    });

    logger.info('Daily quests assigned', { userId, quests: shuffled });
  },

  async updateStreak(userId: string): Promise<void> {
    const progression = await prisma.progression.findUnique({ where: { userId } });
    if (!progression) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let newStreak = 1;
    if (progression.lastQuestDate) {
      const lastDate = new Date(progression.lastQuestDate);
      lastDate.setHours(0, 0, 0, 0);
      if (lastDate.getTime() === yesterday.getTime()) {
        newStreak = progression.streak + 1;
      } else if (lastDate.getTime() === today.getTime()) {
        return; // Already updated today
      }
    }

    const longestStreak = Math.max(newStreak, progression.longestStreak);
    await prisma.progression.update({
      where: { userId },
      data: { streak: newStreak, longestStreak, lastQuestDate: new Date() },
    });

    emitToUser(userId, 'streak-updated', { streak: newStreak, longestStreak });
  },

  async getProgression(userId: string) {
    const progression = await prisma.progression.findUnique({ where: { userId } });
    if (!progression) return null;

    const currentLevelXp = LEVEL_THRESHOLDS[progression.level - 1] ?? 0;
    const nextLevelXp = LEVEL_THRESHOLDS[progression.level] ?? null;
    const xpInCurrentLevel = progression.totalXp - currentLevelXp;
    const xpNeededForNext = nextLevelXp ? nextLevelXp - currentLevelXp : null;

    return {
      ...progression,
      title: LEVEL_TITLES[progression.level] ?? `Level ${progression.level}`,
      xpInCurrentLevel,
      xpNeededForNext,
      progressPercent: xpNeededForNext
        ? Math.round((xpInCurrentLevel / xpNeededForNext) * 100)
        : 100,
    };
  },
};
