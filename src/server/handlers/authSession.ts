import { Request, Response } from 'express';
import { getUserFromSession } from '../utils/auth.js';
import { createDatabaseClient } from '../database.js';
import { asRows } from '../utils/helpers.js';
import pino from 'pino';
import { appConfig } from '../config.js';

const sql = createDatabaseClient();
const logger = pino({ level: appConfig.logLevel });

// Check current session
export async function checkSession(req: Request, res: Response): Promise<void> {
  try {
    const sessionToken = req.cookies.session_token;
    const user = await getUserFromSession(sessionToken);

    if (!user) {
      res.status(401).json({ success: false });
      return;
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar_url,
        role: user.role,
        isAdmin: user.role === 'admin',
      },
    });
  } catch (error) {
    logger.error({ err: error }, 'Session check error');
    res.status(500).json({ message: 'Failed to check session' });
  }
}

// Sign out and destroy session
export async function signOut(req: Request, res: Response): Promise<void> {
  try {
    const sessionToken = req.cookies.session_token;

    if (sessionToken) {
      await sql`
        DELETE FROM sessions WHERE session_token = ${sessionToken}
      `;
      logger.info('User signed out');
    }

    res.clearCookie('session_token');
    res.json({ success: true });
  } catch (error) {
    logger.error({ err: error }, 'Sign out error');
    res.status(500).json({ message: 'Failed to sign out' });
  }
}

// Google OAuth callback
export async function googleOAuthCallback(req: Request, res: Response): Promise<void> {
  try {
    const { code, redirect_uri } = req.body;

    if (!code) {
      res.status(400).json({ message: 'Authorization code required' });
      return;
    }

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      logger.error({ error }, 'Google token exchange failed');
      res.status(400).json({ message: 'Failed to exchange authorization code' });
      return;
    }

    const tokens = await tokenResponse.json();

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      res.status(400).json({ message: 'Failed to get user info' });
      return;
    }

    const googleUser = await userInfoResponse.json();

    // Get or create user in database
    let user = await sql`
      SELECT *
      FROM users
      WHERE email = ${googleUser.email}
    `.then(rows => rows[0]);

    if (!user) {
      const createdUsers = await sql`
        INSERT INTO users (email, name, avatar_url, tokens)
        VALUES (${googleUser.email}, ${googleUser.name}, ${googleUser.picture}, 100)
        RETURNING *
      `;
      user = asRows(createdUsers)[0];

      await sql`
        INSERT INTO user_profiles (user_id, created_at, updated_at)
        VALUES (${user.id}, NOW(), NOW())
        ON CONFLICT (user_id) DO NOTHING
      `;

      logger.info({ email: googleUser.email }, 'New Google user created');
    } else {
      const updatedUsers = await sql`
        UPDATE users
        SET
          name = COALESCE(${googleUser.name}, users.name),
          avatar_url = COALESCE(${googleUser.picture}, users.avatar_url)
        WHERE id = ${user.id}
        RETURNING *
      `;
      user = asRows(updatedUsers)[0] ?? user;
    }

    // Create session
    const sessionToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await sql`
      INSERT INTO sessions (user_id, session_token, expires_at)
      VALUES (${user.id}, ${sessionToken}, ${expiresAt})
    `;

    // Set session cookie
    res.cookie('session_token', sessionToken, {
      httpOnly: true,
      secure: appConfig.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    logger.info({ email: user.email, userId: user.id }, 'Google login successful');

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar_url,
        role: user.role,
        isAdmin: user.role === 'admin',
      },
    });
  } catch (error) {
    logger.error({ err: error }, 'Google OAuth callback error');
    res.status(500).json({ message: 'Google authentication failed' });
  }
}
