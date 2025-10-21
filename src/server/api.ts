/**
 * Backend API Server for TaTTTy - Modular Architecture
 * Production-ready authentication with Neon database + RLS + Stack Auth
 *
 * Features:
 * - Email OTP authentication via Stack Auth
 * - Google OAuth
 * - Row Level Security (RLS)
 * - UUIDs for all IDs
 * - 30-day sessions
 * - Modular architecture with separate routes, handlers, and middleware
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { appConfig } from './config.js';
import { globalRateLimiter } from './middleware/rateLimiters.js';
import { testEmailConnection } from './emailService.js';
import { createDatabaseClient } from './database.js';

// Import modular routes
import healthRouter from './routes/health.js';
import examplesRouter from './routes/examples.js';
import authRouter from './routes/auth.js';
import dbRouter from './routes/db.js';
import aiRouter from './routes/ai.js';

const app = express();
const PORT = appConfig.port || 3001;
const logger = pino({ level: appConfig.logLevel });

// Middleware
app.use(pinoHttp({ logger }));
app.use(cors({
  origin: appConfig.corsOrigin || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(globalRateLimiter);

// Routes
app.use(healthRouter);
app.use(examplesRouter);
app.use(authRouter);
app.use(dbRouter);
app.use(aiRouter);

// Test email connection on startup
testEmailConnection()
  .then((success) => {
    if (success) {
      logger.info('Email service connected');
    } else {
      logger.warn('Email service unavailable - OTPs will log to console');
    }
  })
  .catch(error => logger.error({ err: error }, 'Email service connection check failed'));

// ============================================
// CLEANUP JOBS
// ============================================

// Clean up expired OTPs and sessions every hour
const cleanupSql = createDatabaseClient();

setInterval(async () => {
  try {
    await cleanupSql`SELECT cleanup_expired_otps()`;
    await cleanupSql`SELECT cleanup_expired_sessions()`;
    logger.info('Cleaned up expired OTPs and sessions');
  } catch (error) {
    logger.error({ err: error }, 'Cleanup error');
  }
}, 60 * 60 * 1000); // 1 hour

// Start server
app.listen(PORT, () => {
  logger.info({ port: PORT, env: appConfig.nodeEnv }, 'TaTTTy API server running');
});

export default app;
