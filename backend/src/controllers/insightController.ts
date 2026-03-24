import { Request, Response, NextFunction } from 'express';
import { insightService } from '../services/insightService';

export const insightController = {
  async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await insightService.getDashboard(req.user!.userId);
      res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
  },

  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await insightService.getCategoryBreakdown(req.user!.userId);
      res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
  },

  async getTrends(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await insightService.getTrends(req.user!.userId);
      res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
  },

  async getAnomalies(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await insightService.getAnomalies(req.user!.userId);
      res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
  },

  async getCoaching(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await insightService.getCoachingTips(req.user!.userId);
      res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
  },
};
