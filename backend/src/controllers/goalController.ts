import { Request, Response, NextFunction } from 'express';
import { goalService } from '../services/goalService';

export const goalController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const goal = await goalService.create(req.user!.userId, req.body);
      res.status(201).json({ success: true, data: goal });
    } catch (err) { next(err); }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const goals = await goalService.list(req.user!.userId);
      res.status(200).json({ success: true, data: goals });
    } catch (err) { next(err); }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await goalService.update(req.user!.userId, req.params.id, req.body);
      res.status(200).json({ success: true, data: updated });
    } catch (err) { next(err); }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await goalService.delete(req.user!.userId, req.params.id);
      res.status(204).send();
    } catch (err) { next(err); }
  },
};
