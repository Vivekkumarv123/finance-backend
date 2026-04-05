import type{ Request, Response, NextFunction } from "express";
import { DashboardService } from "./dashboard.service.js";

export const DashboardController = {
  summary: async (req: any, res: Response, next: NextFunction) => {
    try {
      const data = await DashboardService.getSummary(
        req.user.userId,
        req.user.role
      );
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  category: async (req: any, res: Response, next: NextFunction) => {
    try {
      const data = await DashboardService.getCategoryBreakdown(
        req.user.userId,
        req.user.role
      );
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  monthly: async (req: any, res: Response, next: NextFunction) => {
    try {
      const year = req.query.year ? Number(req.query.year) : undefined;

      const data = await DashboardService.getMonthlyTrends(
        req.user.userId,
        req.user.role,
        year
      );
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  recent: async (req: any, res: Response, next: NextFunction) => {
    try {
      const data = await DashboardService.getRecent(
        req.user.userId,
        req.user.role
      );
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
};