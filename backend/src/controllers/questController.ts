import { Request, Response, NextFunction } from 'express';
import { questService } from '../services/questService';
import { gamificationService } from '../services/gamificationService';

export const questController = {
  async getToday(req: Request, res: Response, next: NextFunction) {
    try {
      const quests = await questService.getToday(req.user!.userId);
      res.status(200).json({ success: true, data: quests });
    } catch (err) { next(err); }
  },

  async complete(req: Request, res: Response, next: NextFunction) {
    try {
      const quest = await questService.complete(req.user!.userId, req.params.id);
      const progression = await gamificationService.getProgression(req.user!.userId);
      res.status(200).json({ success: true, data: { quest, progression } });
    } catch (err) { next(err); }
  },

  async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const history = await questService.getHistory(req.user!.userId);
      res.status(200).json({ success: true, data: history });
    } catch (err) { next(err); }
  },
};
