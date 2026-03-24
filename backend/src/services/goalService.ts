import { prisma } from '../config/database';
import { AppError } from '../middlewares/errorHandler';
import { ERRORS } from '../utils/constants';
import { emitToUser } from '../config/socket';
import { gamificationService } from './gamificationService';
import { ICreateGoalInput } from '../types';

export const goalService = {
  async create(userId: string, input: ICreateGoalInput) {
    const goal = await prisma.goal.create({
      data: {
        userId,
        title: input.title,
        description: input.description,
        category: input.category,
        targetAmount: input.targetAmount,
        currentAmount: input.currentAmount ?? 0,
        targetDate: new Date(input.targetDate),
      },
    });

    await gamificationService.checkQuestProgress(userId, 'ADD_GOAL');
    emitToUser(userId, 'notification', {
      type: 'goal_created',
      title: 'Goal Created! 🎯',
      message: `"${goal.title}" has been added.`,
    });

    return goal;
  },

  async list(userId: string) {
    const goals = await prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return goals.map((g) => ({
      ...g,
      progressPercent: Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100)),
      daysRemaining: Math.max(0, Math.ceil((g.targetDate.getTime() - Date.now()) / 86400000)),
    }));
  },

  async update(userId: string, id: string, input: Partial<ICreateGoalInput> & { currentAmount?: number }) {
    const existing = await prisma.goal.findFirst({ where: { id, userId } });
    if (!existing) throw new AppError(ERRORS.NOT_FOUND, 404);

    const data: Record<string, unknown> = {};
    if (input.title !== undefined) data.title = input.title;
    if (input.description !== undefined) data.description = input.description;
    if (input.category !== undefined) data.category = input.category;
    if (input.targetAmount !== undefined) data.targetAmount = input.targetAmount;
    if (input.currentAmount !== undefined) {
      data.currentAmount = input.currentAmount;
      // Check if goal just completed
      const targetAmount = (input.targetAmount ?? existing.targetAmount);
      if (input.currentAmount >= targetAmount && !existing.completedAt) {
        data.completedAt = new Date();
        emitToUser(userId, 'goal-milestone', { goalId: id, title: existing.title, percent: 100 });
      } else {
        const percent = Math.round((input.currentAmount / targetAmount) * 100);
        if (percent >= 50 && Math.round((existing.currentAmount / targetAmount) * 100) < 50) {
          emitToUser(userId, 'goal-milestone', { goalId: id, title: existing.title, percent: 50 });
        }
      }
    }
    if (input.targetDate !== undefined) data.targetDate = new Date(input.targetDate);

    const updated = await prisma.goal.update({ where: { id }, data });
    // Award XP on savings transfer
    if (input.currentAmount !== undefined && input.currentAmount > existing.currentAmount) {
      await gamificationService.checkQuestProgress(userId, 'TRANSFER_SAVINGS');
    }
    return updated;
  },

  async delete(userId: string, id: string) {
    const existing = await prisma.goal.findFirst({ where: { id, userId } });
    if (!existing) throw new AppError(ERRORS.NOT_FOUND, 404);
    await prisma.goal.delete({ where: { id } });
  },
};
