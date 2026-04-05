import type { Request, Response, NextFunction } from "express";
import { RecordService } from "./record.service.js";

export const RecordController = {
  create: async (req: any, res: Response, next: NextFunction) => {
    try {
      const result = await RecordService.createRecord(
        req.user.userId,
        req.body
      );
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  getAll: async (req: any, res: Response, next: NextFunction) => {
    try {
      const result = await RecordService.getRecords(
        req.user.userId,
        req.user.role,
        req.query
      );
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  update: async (req: any, res: Response, next: NextFunction) => {
    try {
      const result = await RecordService.updateRecord(
        req.params.id,
        req.user.userId,
        req.user.role,
        req.body
      );
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  remove: async (req: any, res: Response, next: NextFunction) => {
    try {
      await RecordService.softDeleteRecord(
        req.params.id,
        req.user.userId,
        req.user.role
      );
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};