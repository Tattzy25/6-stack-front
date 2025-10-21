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

    // Update last accessed time
    await sql`
      UPDATE sessions
      SET last_accessed = NOW()
      WHERE token = ${sessionToken}
    `;

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
        DELETE FROM sessions WHERE token = ${sessionToken}
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
    const providerResult = await sql`
      SELECT * FROM users
      WHERE provider = 'google'
      AND provider_id = ${googleUser.id}
    `;
    let user = asRows(providerResult)[0];

    if (!user) {
      // Check if email already exists
      const emailResult = await sql`
        SELECT * FROM users WHERE email = ${googleUser.email}
      `;
      user = asRows(emailResult)[0];

      if (user) {
        // Update existing user with Google OAuth
        const updatedGoogleUser = await sql`
          UPDATE users
          SET provider = 'google',
              provider_id = ${googleUser.id},
              name = ${googleUser.name || user.name},
              avatar_url = ${googleUser.picture || user.avatar_url},
              email_verified = true,
              last_login_at = NOW(),
              login_count = login_count + 1
          WHERE id = ${user.id}
          RETURNING *
        `;
        user = asRows(updatedGoogleUser)[0];
      } else {
        // Create new user
        const newUsers = await sql`
          INSERT INTO users (
            email,
            name,
            avatar_url,
            email_verified,
            provider,
            provider_id,
            role
          )
          VALUES (
            ${googleUser.email},
            ${googleUser.name},
            ${googleUser.picture},
            true,
            'google',
            ${googleUser.id},
            'user'
          )
          RETURNING *
        `;
        user = asRows(newUsers)[0];

        // Create user profile
        await sql`
          INSERT INTO user_profiles (user_id)
          VALUES (${user.id})
          ON CONFLICT (user_id) DO NOTHING
        `;

        logger.info({ email: googleUser.email }, 'New Google user created');
      }
    } else {
      // Update last login
      const updatedExistingUser = await sql`
        UPDATE users
        SET last_login_at = NOW(),
            login_count = login_count + 1
        WHERE id = ${user.id}
        RETURNING *
      `;
      user = asRows(updatedExistingUser)[0];
    }

    // Create session
    const sessionToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await sql`
      INSERT INTO sessions (user_id, token, expires_at, ip_address, user_agent)
      VALUES (
        ${user.id},
        ${sessionToken},
        ${expiresAt},
        ${req.ip || null},
        ${req.headers['user-agent'] || null}
      )
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
