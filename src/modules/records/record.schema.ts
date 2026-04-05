import { z } from "zod";

export const createRecordSchema = {
  body: z.object({
    amount: z.number().positive(),
    type: z.enum(["income", "expense"]),
    category: z.string().min(1),
    date: z.string().check(z.iso.datetime()),
    notes: z.string().max(500).optional(),
  }),
};

export const updateRecordSchema = {
  body: z.object({
    amount: z.number().positive().optional(),
    type: z.enum(["income", "expense"]).optional(),
    category: z.string().optional(),
    date: z.string().check(z.iso.datetime()).optional(),
    notes: z.string().max(500).optional(),
  }),
};

export const recordQuerySchema = {
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    type: z.enum(["income", "expense"]).optional(),
    category: z.string().optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
  }),
};