import jwt from 'jsonwebtoken';
import { IAuthPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-dev-secret-change-in-prod';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export const signToken = (payload: IAuthPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
};

export const signRefreshToken = (payload: IAuthPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions);
};

export const verifyToken = (token: string): IAuthPayload => {
  return jwt.verify(token, JWT_SECRET) as IAuthPayload;
};

export const decodeToken = (token: string): IAuthPayload | null => {
  try {
    return jwt.decode(token) as IAuthPayload;
  } catch {
    return null;
  }
};
