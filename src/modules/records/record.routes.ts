import { Router } from "express";
import { RecordController } from "./record.controller.js";
import { authenticate } from "../../common/middleware/authenticate.js";
import { authorizePermissions } from "../../common/middleware/authorize.js";
import { validate } from "../../common/middleware/validate.js";
import {
  createRecordSchema,
  updateRecordSchema,
  recordQuerySchema,
} from "./record.schema.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorizePermissions("record:create"),
  validate(createRecordSchema),
  RecordController.create
);

router.get(
  "/",
  authenticate,
  authorizePermissions("record:read"),
  validate(recordQuerySchema),
  RecordController.getAll
);

router.patch(
  "/:id",
  authenticate,
  authorizePermissions("record:update"),
  validate(updateRecordSchema),
  RecordController.update
);

router.delete(
  "/:id",
  authenticate,
  authorizePermissions("record:delete"),
  RecordController.remove
);

export default router;