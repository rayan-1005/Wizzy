import { Request, Response, NextFunction } from 'express';
import { bossService } from '../services/bossService';

export const bossController = {
  async getActive(req: Request, res: Response, next: NextFunction) {
    try {
      const bosses = await bossService.getActive(req.user!.userId);
      res.status(200).json({ success: true, data: bosses });
    } catch (err) { next(err); }
  },

  async updateHealth(req: Request, res: Response, next: NextFunction) {
    try {
      const { reduction } = req.body;
      const boss = await bossService.updateHealth(req.user!.userId, req.params.id, reduction);
      res.status(200).json({ success: true, data: boss });
    } catch (err) { next(err); }
  },
};
