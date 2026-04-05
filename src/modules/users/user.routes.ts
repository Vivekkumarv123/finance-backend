import { Router } from "express";
import { UserController } from "./user.controller.js";
import { authenticate } from "../../common/middleware/authenticate.js";
import { authorizePermissions } from "../../common/middleware/authorize.js";
import { validate } from "../../common/middleware/validate.js";
import {
  createUserSchema,
  listUsersQuerySchema,
  updateRoleSchema,
  updateStatusSchema,
} from "./user.schema.js";

const router = Router();

// Only admin can manage users
router.post(
  "/",
  authenticate,
  authorizePermissions("user:create"),
  validate( createUserSchema),
  UserController.createUser
);

router.get(
  "/",
  authenticate,
  authorizePermissions("user:read"),
  validate( listUsersQuerySchema),
  UserController.listUsers
);

router.patch(
  "/:id/role",
  authenticate,
  authorizePermissions("user:update"),
  validate(updateRoleSchema),
  UserController.assignRole
);

router.patch(
  "/:id/status",
  authenticate,
  authorizePermissions("user:update"),
  validate(updateStatusSchema),
  UserController.setStatus
);

export default router;