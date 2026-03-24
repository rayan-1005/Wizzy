import { Request, Response, NextFunction } from 'express';
import { expenseService } from '../services/expenseService';

export const expenseController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const expense = await expenseService.create(req.user!.userId, req.body);
      res.status(201).json({ success: true, data: expense });
    } catch (err) { next(err); }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await expenseService.list(req.user!.userId, req.query as never);
      res.status(200).json({ success: true, ...result });
    } catch (err) { next(err); }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const expense = await expenseService.getById(req.user!.userId, req.params.id);
      res.status(200).json({ success: true, data: expense });
    } catch (err) { next(err); }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await expenseService.update(req.user!.userId, req.params.id, req.body);
      res.status(200).json({ success: true, data: updated });
    } catch (err) { next(err); }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await expenseService.delete(req.user!.userId, req.params.id);
      res.status(204).send();
    } catch (err) { next(err); }
  },
};
