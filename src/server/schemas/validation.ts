import { z } from 'zod';

export const randomExamplesQuerySchema = z.object({
  category: z.string().trim().min(1).max(64).optional(),
  limit: z.coerce.number().int().min(1).max(24).optional().default(6),
});

export const examplesQuerySchema = z.object({
  category: z.string().trim().min(1).max(64).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const viewParamsSchema = z.object({
  id: z.string().uuid('Example ID must be a valid UUID'),
});

export const otpSendSchema = z.object({
  email: z.string().email('A valid email address is required'),
});

export const otpVerifySchema = z.object({
  email: z.string().email('A valid email address is required'),
  code: z.string().regex(/^\d{6}$/, 'OTP code must be a 6 digit string'),
});

export const dbQuerySchema = z.object({
  sql: z.string().min(1, 'SQL statement is required'),
  params: z.array(z.unknown()).optional().default([]),
});
