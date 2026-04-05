import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { validate } from "../../common/middleware/validate.js";
import { registerBodySchema, loginBodySchema } from "./auth.schema.js";

const router = Router();

router.post("/register", validate({ body: registerBodySchema }), AuthController.register);
router.post("/login", validate({ body: loginBodySchema }), AuthController.login);

export default router;
