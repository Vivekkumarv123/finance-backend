import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";

type Role = "viewer" | "analyst" | "admin";

type Permission =
  | "record:create"
  | "record:read"
  | "record:update"
  | "record:delete"
  | "user:create"
  | "user:read"
  | "user:update"
  | "dashboard:read";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  viewer: ["dashboard:read"],
  analyst: ["dashboard:read", "record:read"],
  admin: [
    "dashboard:read",
    "record:create",
    "record:read",
    "record:update",
    "record:delete",
    "user:create",
    "user:read",
    "user:update",
  ],
};

export const authorizePermissions =
  (...required: Permission[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthenticated", 401);
    }

    const userPermissions = ROLE_PERMISSIONS[req.user.role];

    const hasAccess = required.every((perm) =>
      userPermissions.includes(perm)
    );

    if (!hasAccess) {
      throw new AppError("Insufficient permissions", 403);
    }

    next();
  };