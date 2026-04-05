import { z } from "zod";

export const registerBodySchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().check(z.email()),
  password: z.string().min(6),
});

export const loginBodySchema = z.object({
  email: z.string().check(z.email()),
  password: z.string().min(6),
});

export type RegisterBody = z.infer<typeof registerBodySchema>;
export type LoginBody = z.infer<typeof loginBodySchema>;
