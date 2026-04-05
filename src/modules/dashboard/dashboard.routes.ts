import { Router } from "express";
import { DashboardController } from "./dashboard.controller.js";
import { authenticate } from "../../common/middleware/authenticate.js";
import { authorizePermissions } from "../../common/middleware/authorize.js";

const router = Router();

router.get(
  "/summary",
  authenticate,
  authorizePermissions("dashboard:read"),
  DashboardController.summary
);

router.get(
  "/category",
  authenticate,
  authorizePermissions("dashboard:read"),
  DashboardController.category
);

router.get(
  "/monthly",
  authenticate,
  authorizePermissions("dashboard:read"),
  DashboardController.monthly
);

router.get(
  "/recent",
  authenticate,
  authorizePermissions("dashboard:read"),
  DashboardController.recent
);

export default router;