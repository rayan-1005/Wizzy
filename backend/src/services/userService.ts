import { prisma } from '../config/database';
import { AppError } from '../middlewares/errorHandler';
import { ERRORS } from '../utils/constants';

export const userService = {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, name: true,
        currency: true, timezone: true, monthlyIncome: true,
        createdAt: true, updatedAt: true,
        progression: true,
      },
    });
    if (!user) throw new AppError(ERRORS.NOT_FOUND, 404);
    return user;
  },

  async updateProfile(
    userId: string,
    data: { name?: string; currency?: string; timezone?: string; monthlyIncome?: number }
  ) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true, email: true, name: true,
        currency: true, timezone: true, monthlyIncome: true,
        updatedAt: true,
      },
    });
    return user;
  },
};
