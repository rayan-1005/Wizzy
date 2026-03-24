import bcrypt from 'bcryptjs';
import prisma  from '../config/database';
import { signToken, signRefreshToken, verifyToken } from '../utils/jwt';
import { AppError } from '../middlewares/errorHandler';
import { ERRORS } from '../utils/constants';
import { logger } from '../utils/logger';
import { IRegisterInput, ILoginInput, IAuthResponse } from '../types';

export const authService = {
  async register(input: IRegisterInput): Promise<IAuthResponse> {
    const { email, password, name, monthlyIncome, currency = 'INR', timezone = 'UTC' } = input;

    // Check for existing user
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new AppError(ERRORS.DUPLICATE_EMAIL, 409);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user + initial progression in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: { email, password: hashedPassword, name, monthlyIncome, currency, timezone },
      });
      // Seed initial progression record
      await tx.progression.create({
        data: { userId: newUser.id },
      });
      return newUser;
    });

    const token = signToken({ userId: user.id, email: user.email });
    const refreshToken = signRefreshToken({ userId: user.id, email: user.email });

    // Persist session
    await prisma.session.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    logger.info('New user registered', { userId: user.id, email: user.email });

    return {
      user: {
        id: user.id, email: user.email, name: user.name,
        currency: user.currency, timezone: user.timezone, monthlyIncome: user.monthlyIncome,
      },
      token,
      refreshToken,
    };
  },

  async login(input: ILoginInput): Promise<IAuthResponse> {
    const { email, password } = input;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError(ERRORS.INVALID_CREDENTIALS, 401);

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new AppError(ERRORS.INVALID_CREDENTIALS, 401);

    const token = signToken({ userId: user.id, email: user.email });
    const refreshToken = signRefreshToken({ userId: user.id, email: user.email });

    await prisma.session.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    logger.info('User logged in', { userId: user.id });

    return {
      user: {
        id: user.id, email: user.email, name: user.name,
        currency: user.currency, timezone: user.timezone, monthlyIncome: user.monthlyIncome,
      },
      token,
      refreshToken,
    };
  },

  async logout(refreshToken: string): Promise<void> {
    await prisma.session.deleteMany({ where: { token: refreshToken } });
    logger.info('User logged out');
  },

  async refresh(refreshToken: string): Promise<{ token: string }> {
    if (!refreshToken) throw new AppError('Refresh token is required', 400);  
    const session = await prisma.session.findUnique({ where: { token: refreshToken } });
    if (!session || session.expiresAt < new Date()) {
      throw new AppError(ERRORS.TOKEN_EXPIRED, 401);
    }

    const decoded = verifyToken(refreshToken);
    const newToken = signToken({ userId: decoded.userId, email: decoded.email });

    return { token: newToken };
  },
};
