import express from "express";
import helmet from "helmet";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import { errorHandler } from "./common/middleware/errorHandler.js";
import { rateLimiter } from "./common/middleware/rateLimiter.js";
import userRoutes from "./modules/users/user.routes.js";
import recordRoutes from "./modules/records/record.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimiter);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/records", recordRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// Always last
app.use(errorHandler);

export default app;