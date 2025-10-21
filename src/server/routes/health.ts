import express, { Request, Response } from 'express';
import { pingDatabase, createDatabaseClient } from '../database.js';

const router = express.Router();
const sql = createDatabaseClient();

// Health endpoint (root level)
router.get('/health', async (_req, res) => {
  const timestamp = new Date().toISOString();

  if (!process.env.DATABASE_URL) {
    return res.json({
      status: 'ok',
      timestamp,
      database: 'not_configured',
      environment: process.env.NODE_ENV || 'development',
    });
  }

  const databaseOnline = await pingDatabase(sql);
  const status = databaseOnline ? 'ok' : 'error';
  const httpStatus = databaseOnline ? 200 : 503;

  res.status(httpStatus).json({
    status,
    timestamp,
    database: databaseOnline ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Health endpoint (API level)
router.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await sql`SELECT 1`;

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
    });
  }
});

export default router;
