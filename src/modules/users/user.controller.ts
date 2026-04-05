import type { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service.js";

export const UserController = {
  createUser: async (req: any, res: Response, next: NextFunction) => {
    try {
      const result = await UserService.createUser(
        req.body,
        req.user.userId
      );
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  listUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await UserService.listUsers(req.query);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  assignRole: async (req: any, res: Response, next: NextFunction) => {
    try {
      const result = await UserService.assignRole(
        req.params.id,
        req.body.role,
        req.user.userId
      );
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  setStatus: async (req: any, res: Response, next: NextFunction) => {
    try {
      const result = await UserService.setActiveStatus(
        req.params.id,
        req.body.isActive,
        req.user.userId
      );
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },
};