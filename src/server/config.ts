import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().optional(),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  STACK_PROJECT_ID: z.string().min(1, 'STACK_PROJECT_ID is required'),
  STACK_SECRET_SERVER_KEY: z.string().min(1, 'STACK_SECRET_SERVER_KEY is required'),
  STACK_PUBLISHABLE_CLIENT_KEY: z.string().min(1, 'STACK_PUBLISHABLE_CLIENT_KEY is required'),
  APP_URL: z.string().url('APP_URL must be a valid URL').optional(),
  SMTP_HOST: z.string().min(1, 'SMTP_HOST is required'),
  SMTP_PORT: z.coerce.number().int().positive('SMTP_PORT must be a positive integer'),
  SMTP_SECURE: z
    .enum(['true', 'false'])
    .optional()
    .default('false'),
  SMTP_USER: z.string().min(1, 'SMTP_USER is required'),
  SMTP_PASS: z.string().min(1, 'SMTP_PASS is required'),
  SMTP_FROM_EMAIL: z.string().email('SMTP_FROM_EMAIL must be a valid email address'),
  SMTP_FROM_NAME: z.string().min(1, 'SMTP_FROM_NAME is required').default('TaTTTy'),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
    .optional()
    .default('info'),

});

const parsed = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  STACK_PROJECT_ID: process.env.STACK_PROJECT_ID,
  STACK_SECRET_SERVER_KEY: process.env.STACK_SECRET_SERVER_KEY,
  STACK_PUBLISHABLE_CLIENT_KEY: process.env.STACK_PUBLISHABLE_CLIENT_KEY,
  APP_URL: process.env.APP_URL,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_SECURE: process.env.SMTP_SECURE,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL,
  SMTP_FROM_NAME: process.env.SMTP_FROM_NAME,
  LOG_LEVEL: process.env.LOG_LEVEL,

});

if (!parsed.success) {
  console.error('❌ Environment validation failed:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const env = parsed.data;

export const appConfig = {
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  databaseUrl: env.DATABASE_URL,
  corsOrigin: env.APP_URL,
  stack: {
    projectId: env.STACK_PROJECT_ID,
    secretKey: env.STACK_SECRET_SERVER_KEY,
    publishableClientKey: env.STACK_PUBLISHABLE_CLIENT_KEY,
  },
  smtp: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE === 'true',
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    fromEmail: env.SMTP_FROM_EMAIL,
    fromName: env.SMTP_FROM_NAME,
  },
  logLevel: env.LOG_LEVEL,

} as const;

export type AppConfig = typeof appConfig;
