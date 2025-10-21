import express from 'express';
import { createDatabaseClient } from '../database.js';
import { getUserFromSession, setUserContext } from '../utils/auth.js';
import { asRows } from '../utils/helpers.js';
import { dbQuerySchema } from '../schemas/validation.js';
import pino from 'pino';
import { appConfig } from '../config.js';

const router = express.Router();
const sql = createDatabaseClient();
const logger = pino({ level: appConfig.logLevel });

// Execute database query (with RLS context)
router.post('/api/db/query', async (req, res) => {
  try {
    const sessionToken = req.cookies.session_token;
    const user = await getUserFromSession(sessionToken);

    // Set RLS context
    if (user) {
      await setUserContext(user.id);
    }

    const parsed = dbQuerySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid query payload', details: parsed.error.flatten().fieldErrors });
    }

    const { sql: query, params } = parsed.data;

    // Execute query
    const result = await sql(query, params);
    const rows = asRows(result);

    res.json({
      rows,
      rowCount: rows.length,
    });
  } catch (error) {
    logger.error({ err: error }, 'Database query error');
    res.status(500).json({ message: 'Database query failed' });
  }
});

export default router;
