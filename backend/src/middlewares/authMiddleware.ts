import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { ERRORS } from '../utils/constants';
import { logger } from '../utils/logger';

export const protect = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, error: ERRORS.UNAUTHORIZED });
      return;
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ success: false, error: ERRORS.UNAUTHORIZED });
      return;
    }
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error: unknown) {
    const message =
      error instanceof Error && error.name === 'TokenExpiredError'
        ? ERRORS.TOKEN_EXPIRED
        : ERRORS.TOKEN_INVALID;
    logger.warn('Auth middleware: token rejected', { error: (error as Error).message });
    res.status(401).json({ success: false, error: message });
  }
};
