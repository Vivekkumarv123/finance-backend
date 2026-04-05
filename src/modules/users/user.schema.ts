import { z } from "zod";

export const createUserSchema = {
  body: z.object({
    name: z.string().min(2),
    email: z.string().check(z.email()),
    password: z.string().min(6),
    role: z.enum(["viewer", "analyst", "admin"]),
  }),
};

export const listUsersQuerySchema = {
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    role: z.enum(["viewer", "analyst", "admin"]).optional(),
    isActive: z.string().optional(),
  }),
};

export const updateRoleSchema = {
  body: z.object({
    role: z.enum(["viewer", "analyst", "admin"]),
  }),
};

export const updateStatusSchema = {
  body: z.object({
    isActive: z.boolean(),
  }),
};