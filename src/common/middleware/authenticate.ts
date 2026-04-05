import type { Request, Response, NextFunction } from "express";
import type {  TokenPayload } from "../utils/jwe.js";
import  {  decryptToken } from "../utils/jwe.js";
import { AppError } from "../errors/AppError.js";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Authentication required", 401);
    }

    const token = authHeader.split(" ")[1]!;

    const payload = await decryptToken(token);

    req.user = payload;

    next();
  } catch (err) {
    next(err);
  }
};