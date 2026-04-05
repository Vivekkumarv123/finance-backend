import express from "express";
import helmet from "helmet";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import { errorHandler } from "./common/middleware/errorHandler.js";
import { rateLimiter } from "./common/middleware/rateLimiter.js";
import userRoutes from "./modules/users/user.routes.js";
import recordRoutes from "./modules/records/record.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimiter);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/records", recordRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

const swaggerDocument = YAML.load(
  path.join(process.cwd(), "src/config/swagger.yaml")
);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Always last
app.use(errorHandler);

export default app;