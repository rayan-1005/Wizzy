import { prisma } from '../config/database';
import { AppError } from '../middlewares/errorHandler';
import { ERRORS } from '../utils/constants';
import { emitToUser } from '../config/socket';
import { gamificationService } from './gamificationService';
import { ICreateTransactionInput, ITransactionFilters, IPaginatedResponse, ITransaction } from '../types';

export const expenseService = {
  async create(userId: string, input: ICreateTransactionInput) {
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        amount: input.amount,
        category: input.category,
        description: input.description,
        date: new Date(input.date),
        isRecurring: input.isRecurring ?? false,
        recurringFrequency: input.recurringFrequency,
      },
    });

    // Emit real-time event
    emitToUser(userId, 'expense-created', transaction);

    // Check & award quest progress
    await gamificationService.checkQuestProgress(userId, 'LOG_EXPENSE');

    return transaction;
  },

  async list(
    userId: string,
    filters: ITransactionFilters
  ): Promise<IPaginatedResponse<ITransaction>> {
    const { page = 1, limit = 50, category, startDate, endDate, minAmount, maxAmount } = filters;
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(category && { category }),
      ...(startDate || endDate
        ? { date: { ...(startDate && { gte: new Date(startDate) }), ...(endDate && { lte: new Date(endDate) }) } }
        : {}),
      ...(minAmount !== undefined || maxAmount !== undefined
        ? { amount: { ...(minAmount !== undefined && { gte: minAmount }), ...(maxAmount !== undefined && { lte: maxAmount }) } }
        : {}),
    };

    const [data, total] = await Promise.all([
      prisma.transaction.findMany({ where, skip, take: limit, orderBy: { date: 'desc' } }),
      prisma.transaction.count({ where }),
    ]);

    return {
      data: data as ITransaction[],
      pagination: {
        page, limit, total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  },

  async getById(userId: string, id: string) {
    const transaction = await prisma.transaction.findFirst({ where: { id, userId } });
    if (!transaction) throw new AppError(ERRORS.NOT_FOUND, 404);
    return transaction;
  },

  async update(userId: string, id: string, input: Partial<ICreateTransactionInput>) {
    const existing = await prisma.transaction.findFirst({ where: { id, userId } });
    if (!existing) throw new AppError(ERRORS.NOT_FOUND, 404);

    const updated = await prisma.transaction.update({
      where: { id },
      data: {
        ...(input.amount !== undefined && { amount: input.amount }),
        ...(input.category && { category: input.category }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.date && { date: new Date(input.date) }),
        ...(input.isRecurring !== undefined && { isRecurring: input.isRecurring }),
        ...(input.recurringFrequency !== undefined && { recurringFrequency: input.recurringFrequency }),
      },
    });

    emitToUser(userId, 'expense-updated', updated);
    return updated;
  },

  async delete(userId: string, id: string) {
    const existing = await prisma.transaction.findFirst({ where: { id, userId } });
    if (!existing) throw new AppError(ERRORS.NOT_FOUND, 404);
    await prisma.transaction.delete({ where: { id } });
    emitToUser(userId, 'expense-deleted', { id });
  },
};
