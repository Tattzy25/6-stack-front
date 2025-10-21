import express from 'express';
import { createDatabaseClient } from '../database.js';
import { getUserFromSession, setUserContext } from '../utils/auth.js';
import { asRows } from '../utils/helpers.js';
import pino from 'pino';
import { appConfig } from '../config.js';

const router = express.Router();
const sql = createDatabaseClient();
const logger = pino({ level: appConfig.logLevel });

// Get user's ink balance and tier
router.get('/api/ink/balance', async (req, res) => {
  try {
    const sessionToken = req.cookies.session_token;
    const user = await getUserFromSession(sessionToken);

    if (!user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Set RLS context
    await setUserContext(user.id);

    const userRecord = await sql`
      SELECT tokens, role
      FROM users
      WHERE id = ${user.id}
    `;

    let profile = asRows(userRecord)[0];

    if (!profile) {
      res.status(404).json({ message: 'User record not found' });
      return;
    }

    if (profile.tokens == null) {
      const updated = await sql`
        UPDATE users
        SET tokens = 100
        WHERE id = ${user.id}
        RETURNING tokens, role
      `;
      profile = asRows(updated)[0] ?? profile;
    }

    const tier = profile.role === 'admin' ? 'studio' : 'free';

    res.json({
      balance: profile.tokens ?? 0,
      tier,
      usageToday: {
        ideas: 0,
        brainstormMessages: 0,
        upscales2x: 0
      }
    });

  } catch (error) {
    logger.error({ err: error }, 'Ink balance query error');
    res.status(500).json({ message: 'Failed to fetch ink balance' });
  }
});

// Update user's ink balance
router.post('/api/ink/deduct', async (req, res) => {
  try {
    const sessionToken = req.cookies.session_token;
    const user = await getUserFromSession(sessionToken);

    if (!user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { amount, reason } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Set RLS context
    await setUserContext(user.id);

    const balanceResult = await sql`
      SELECT tokens
      FROM users
      WHERE id = ${user.id}
      FOR UPDATE
    `;

    const currentBalance = asRows(balanceResult)[0]?.tokens ?? 0;

    if (currentBalance < amount) {
      return res.status(400).json({
        message: 'Insufficient ink balance',
        currentBalance,
        required: amount
      });
    }

    const updateResult = await sql`
      UPDATE users
      SET tokens = tokens - ${amount}
      WHERE id = ${user.id}
      RETURNING tokens
    `;

    const newBalance = asRows(updateResult)[0]?.tokens ?? 0;

    // Log transaction (optional - you might want to create an ink_transactions table)
    logger.info({ 
      userId: user.id, 
      amount, 
      reason, 
      oldBalance: currentBalance, 
      newBalance 
    }, 'Ink deducted');

    res.json({
      success: true,
      newBalance,
      deducted: amount
    });

  } catch (error) {
    logger.error({ err: error }, 'Ink deduction error');
    res.status(500).json({ message: 'Failed to deduct ink' });
  }
});

export default router;