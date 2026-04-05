import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

export const validate =
  (schema: {
    body?: ZodType;
    query?: ZodType;
    params?: ZodType;
  }) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }

      if (schema.query) {
        // Express 5: req.query is read-only, use Object.assign to merge
        const parsed = schema.query.parse(req.query) as Record<string, unknown>;
        Object.assign(req.query, parsed);
      }

      if (schema.params) {
        // Express 5: req.params is read-only, use Object.assign to merge
        const parsed = schema.params.parse(req.params) as Record<string, string>;
        Object.assign(req.params, parsed);
      }

      next();
    } catch (err) {
      next(err);
    }
  };
