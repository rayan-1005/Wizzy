import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/userService';

export const userController = {
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const profile = await userService.getProfile(userId);
      res.status(200).json({ success: true, data: profile });
    } catch (err) { next(err); }
  },

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const updated = await userService.updateProfile(userId, req.body);
      res.status(200).json({ success: true, data: updated });
    } catch (err) { next(err); }
  },
};
