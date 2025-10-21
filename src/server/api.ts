/**
 * Backend API Server for TaTTTy
 * Production-ready authentication with Neon database + RLS + Stack Auth
 * 
 * Features:
 * - Email OTP authentication via Stack Auth
 * - Google OAuth
 * - Row Level Security (RLS)
 * - UUIDs for all IDs
 * - 30-day sessions
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import { sendOTPEmail, sendWelcomeEmail, testEmailConnection } from './emailService.js';
import { createDatabaseClient, pingDatabase, type DatabaseClient } from './database.js';

type ServerOverrides = {
  sql?: DatabaseClient;
  sendOTPEmail?: typeof sendOTPEmail;
  sendWelcomeEmail?: typeof sendWelcomeEmail;
  testEmailConnection?: typeof testEmailConnection;
  pingDatabase?: typeof pingDatabase;
};

const overrides: ServerOverrides =
  (globalThis as unknown as { __TATTY_SERVER_OVERRIDES__?: ServerOverrides }).__TATTY_SERVER_OVERRIDES__ ?? {};

const emailService = {
  sendOTPEmail: overrides.sendOTPEmail ?? sendOTPEmail,
  sendWelcomeEmail: overrides.sendWelcomeEmail ?? sendWelcomeEmail,
  testEmailConnection: overrides.testEmailConnection ?? testEmailConnection,
};

const pingDb = overrides.pingDatabase ?? pingDatabase;
import rateLimit from 'express-rate-limit';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { z } from 'zod';
import { appConfig } from './config.js';

const app = express();
const PORT = appConfig.port || 3001;
const logger = pino({ level: appConfig.logLevel });

// Database connection
const sql = overrides.sql ?? createDatabaseClient(process.env.DATABASE_URL || '');
const sql = neon(appConfig.databaseUrl);

// Middleware
app.use(pinoHttp({ logger }));
app.use(cors({
  origin: appConfig.corsOrigin || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// ============================================
// HEALTH CHECKS
// ============================================

app.get('/health', async (_req, res) => {
  const timestamp = new Date().toISOString();

  if (!process.env.DATABASE_URL) {
    return res.json({
      status: 'ok',
      timestamp,
      database: 'not_configured',
      environment: process.env.NODE_ENV || 'development',
    });
  }

  const databaseOnline = await pingDb(sql);
  const status = databaseOnline ? 'ok' : 'error';
  const httpStatus = databaseOnline ? 200 : 503;

  res.status(httpStatus).json({
    status,
    timestamp,
    database: databaseOnline ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development',
  });
const globalRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalRateLimiter);

const randomExamplesQuerySchema = z.object({
  category: z.string().trim().min(1).max(64).optional(),
  limit: z.coerce.number().int().min(1).max(24).optional().default(6),
});

const examplesQuerySchema = z.object({
  category: z.string().trim().min(1).max(64).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

const viewParamsSchema = z.object({
  id: z.string().uuid('Example ID must be a valid UUID'),
});

const otpSendSchema = z.object({
  email: z.string().email('A valid email address is required'),
});

const otpVerifySchema = z.object({
  email: z.string().email('A valid email address is required'),
  code: z.string().regex(/^\d{6}$/, 'OTP code must be a 6 digit string'),
});

const dbQuerySchema = z.object({
  sql: z.string().min(1, 'SQL statement is required'),
  params: z.array(z.unknown()).optional().default([]),
});

const otpRequestLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({ message: 'Too many OTP requests. Please try again later.' });
  },
});

const otpVerifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({ message: 'Too many OTP attempts. Please wait and try again.' });
  },
});

// ==========================================
// EXAMPLE IMAGES ROUTES
// ==========================================

// Get random examples
app.get('/api/examples/random', async (req, res) => {
  const categoryParam = typeof req.query.category === 'string' ? req.query.category : undefined;
  const limitParam = typeof req.query.limit === 'string' ? req.query.limit : undefined;
  const limitValue = Number.parseInt(limitParam ?? '6', 10) || 6;
  const parsed = randomExamplesQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: 'Invalid query parameters',
      details: parsed.error.flatten().fieldErrors,
    });
  }

  const { category, limit } = parsed.data;

  try {
    const results = await sql`
      SELECT * FROM get_random_examples(
        ${categoryParam ?? null}::VARCHAR,
        ${limitValue}::INTEGER
      )
    `;

    const rows = Array.isArray(results) ? (results as any[]) : [];

    res.json({
      success: true,
      examples: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Error fetching random examples:', error);
        ${category ?? null}::VARCHAR,
        ${limit}::INTEGER
      )
    `;

    res.json({
      success: true,
      examples: results,
      count: results.length,
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching random examples');
    res.status(500).json({
      success: false,
      error: 'Failed to fetch examples',
      examples: [],
    });
  }
});

// Get featured examples
app.get('/api/examples/featured', async (req, res) => {
  try {
    const results = await sql`
      SELECT * FROM get_featured_examples()
    `;

    const rows = Array.isArray(results) ? (results as any[]) : [];

    res.json({
      success: true,
      examples: rows,
      count: rows.length
    res.json({
      success: true,
      examples: results,
      count: results.length
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching featured examples');
    res.status(500).json({
      success: false,
      error: 'Failed to fetch featured examples',
      examples: []
    });
  }
});

// Get examples by category
app.get('/api/examples', async (req, res) => {
  const categoryParam = typeof req.query.category === 'string' ? req.query.category : undefined;
  const limitParam = typeof req.query.limit === 'string' ? req.query.limit : undefined;

  try {
    let results: unknown;

    if (categoryParam) {
  const parsed = examplesQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: 'Invalid query parameters',
      details: parsed.error.flatten().fieldErrors,
    });
  }

  const { category, limit } = parsed.data;

  try {
    let results;

    if (category) {
      results = await sql`
        SELECT
          id, title, description, image_url, thumbnail_url,
          category, style, tags, is_featured, display_order
        FROM example_images
        WHERE is_active = TRUE AND category = ${categoryParam}
        ORDER BY display_order, created_at DESC
      `;
    } else {
      results = await sql`
        SELECT
          id, title, description, image_url, thumbnail_url,
          category, style, tags, is_featured, display_order
        FROM example_images
        WHERE is_active = TRUE
        ORDER BY display_order, created_at DESC
      `;
    }

    const rows = Array.isArray(results) ? (results as any[]) : [];

    const limitedRows = limitParam ? rows.slice(0, Number.parseInt(limitParam, 10) || rows.length) : rows;

    res.json({
      success: true,
      examples: limitedRows,
      count: limitedRows.length
    
    if (typeof limit === 'number') {
      results = results.slice(0, limit);
    }

    res.json({
      success: true,
      examples: results,
      count: results.length
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching examples');
    res.status(500).json({
      success: false,
      error: 'Failed to fetch examples',
      examples: []
    });
  }
});

// Increment view count
app.post('/api/examples/:id/view', async (req, res) => {
  const parsed = viewParamsSchema.safeParse(req.params);

  if (!parsed.success) {
    return res.status(400).json({ success: false, error: 'Invalid example identifier' });
  }

  const { id } = parsed.data;

  try {
    await sql`
      UPDATE example_images
      SET view_count = view_count + 1
      WHERE id = ${id}
    `;

    res.json({ success: true });
  } catch (error) {
    logger.error({ err: error }, 'Error incrementing view count');
    res.status(500).json({ success: false });
  }
});

// Test email connection on startup
if (process.env.NODE_ENV !== 'test') {
  emailService.testEmailConnection()
    .then(() => console.log('✅ Email service connected'))
    .catch(() => console.warn('⚠️  Email service unavailable - OTPs will log to console'));
}
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
// HELPER FUNCTIONS
// ============================================

// Generate random 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function asRows<T = any>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

// Generate session token
function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Get user from session token
async function getUserFromSession(token: string) {
  if (!token) return null;

  const result = await sql`
    SELECT u.* FROM users u
    JOIN sessions s ON u.id = s.user_id
    WHERE s.token = ${token}
    AND s.expires_at > NOW()
  `;

  return result[0] || null;
}

// Set RLS context for database queries
async function setUserContext(userId: string | null) {
  if (userId) {
    await sql`SET LOCAL app.user_id = ${userId}`;
  }
}

// ============================================
// AUTH ENDPOINTS
// ============================================

/**
 * POST /api/auth/otp/send
 * Send OTP to user's email
 */
app.post('/api/auth/otp/send', otpRequestLimiter, async (req, res) => {
  const parsed = otpSendSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  const { email } = parsed.data;

  try {
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await sql`
      INSERT INTO otp_codes (email, code, expires_at)
      VALUES (${email}, ${code}, ${expiresAt})
    `;

    // Send OTP email
    const emailSent = await emailService.sendOTPEmail(email, code);
    const emailSent = await sendOTPEmail(email, code);

    logger.info({ email }, 'OTP generated');

    res.json({
      success: true,
      message: emailSent
        ? 'OTP sent to your email'
        : 'OTP generated (check server logs in development)',
    });
  } catch (error) {
    logger.error({ err: error }, 'Send OTP error');
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

/**
 * POST /api/auth/otp/verify
 * Verify OTP and create session
 * Validates user OTPs and establishes authenticated sessions
 */
app.post('/api/auth/otp/verify', otpVerifyLimiter, async (req, res) => {
  const parsed = otpVerifySchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: 'Email and code required' });
  }

  const { email, code } = parsed.data;

  try {
    let user: any;

    const otpResult = await sql`
      SELECT * FROM otp_codes
      WHERE email = ${email}
      AND code = ${code}
      AND expires_at > NOW()
      AND used = false
      ORDER BY created_at DESC
      LIMIT 1
    `;

      // Get or create admin user
      const adminResult = await sql`
        SELECT * FROM users WHERE email = ${email}
      `;
      user = asRows(adminResult)[0];

      if (!user) {
        const newUsers = await sql`
          INSERT INTO users (email, email_verified, provider, role, is_master_user)
          VALUES (${email}, true, 'email', 'admin', true)
          RETURNING *
        `;
        user = asRows(newUsers)[0];
    if (otpResult.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    await sql`
      UPDATE otp_codes
      SET used = true
      WHERE id = ${otpResult[0].id}
    `;

    user = await sql`
      SELECT * FROM users WHERE email = ${email}
    `.then(r => r[0]);

    if (!user) {
      const newUsers = await sql`
        INSERT INTO users (email, email_verified, provider, role)
        VALUES (${email}, true, 'email', 'user')
        RETURNING *
      `;
      user = newUsers[0];

      const otpRows = asRows(otpResult);

      if (otpRows.length === 0) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }

      // Mark OTP as used
      await sql`
        UPDATE otp_codes
        SET used = true
        WHERE id = ${otpRows[0]?.id}
      `;

      // Get or create user
      const userResult = await sql`
        SELECT * FROM users WHERE email = ${email}
      `;
      user = asRows(userResult)[0];

      if (!user) {
        const newUsers = await sql`
          INSERT INTO users (email, email_verified, provider, role)
          VALUES (${email}, true, 'email', 'user')
          RETURNING *
        `;
        user = asRows(newUsers)[0];

        // Create user profile
        await sql`
          INSERT INTO user_profiles (user_id)
          VALUES (${user.id})
          ON CONFLICT (user_id) DO NOTHING
        `;

        // Send welcome email (don't await - send in background)
        emailService.sendWelcomeEmail(email, user.name).catch(err =>
          console.error('Failed to send welcome email:', err)
        );

        console.log(`🎉 New user signup: ${email}`);
      }
    }

    // Update last login and increment login count
    const updatedUser = await sql`
      await sql`
        INSERT INTO user_profiles (user_id)
        VALUES (${user.id})
        ON CONFLICT (user_id) DO NOTHING
      `;

      sendWelcomeEmail(email, user.name).catch(err =>
        logger.error({ err }, 'Failed to send welcome email')
      );

      logger.info({ email }, 'New user signup');
    }

    await sql`
      UPDATE users
      SET last_login_at = NOW(),
          login_count = login_count + 1
      WHERE id = ${user.id}
      RETURNING *
    `;
    user = asRows(updatedUser)[0] ?? user;

    const sessionToken = generateSessionToken();
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

    res.cookie('session_token', sessionToken, {
      httpOnly: true,
      secure: appConfig.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    logger.info({ email, userId: user.id }, 'Login successful');

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
    logger.error({ err: error }, 'Verify OTP error');
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
});

/**
 * GET /api/auth/session
 * Check current session
 */
app.get('/api/auth/session', async (req, res) => {
  try {
    const sessionToken = req.cookies.session_token;
    const user = await getUserFromSession(sessionToken);

    if (!user) {
      return res.status(401).json({ success: false });
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
});

/**
 * POST /api/auth/signout
 * Sign out and destroy session
 */
app.post('/api/auth/signout', async (req, res) => {
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
});

/**
 * POST /api/auth/google/callback
 * Handle Google OAuth callback
 */
app.post('/api/auth/google/callback', async (req, res) => {
  try {
    const { code, redirect_uri } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Authorization code required' });
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
      return res.status(400).json({ message: 'Failed to exchange authorization code' });
    }

    const tokens = await tokenResponse.json();

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      return res.status(400).json({ message: 'Failed to get user info' });
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
        user = asRows(updatedGoogleUser)[0] ?? user;
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
      user = asRows(updatedExistingUser)[0] ?? user;
    }

    // Create session
    const sessionToken = generateSessionToken();
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
});

// ============================================
// DATABASE QUERIES (Protected with RLS)
// ============================================

/**
 * GET /api/db/query
 * Execute database query (with RLS context)
 * This is used by the frontend neonClient
 */
app.post('/api/db/query', async (req, res) => {
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

// ============================================
// AI STREAMING ENDPOINT
// ============================================

/**
 * POST /api/ai/stream
 * Stream AI responses in real-time
 * Provider-agnostic - configure with environment variables
 */
app.post('/api/ai/stream', async (req, res) => {
  try {
    const { type, contextType, targetField, targetText, hasSelection } = req.body;

    // Validate request
    if (!type || !contextType) {
      return res.status(400).json({ error: 'Missing required fields: type, contextType' });
    }

    // Set headers for SSE (Server-Sent Events)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Build the prompt based on type using personas (NO HARDCODING)
    let systemPrompt = '';
    let userPrompt = '';

    if (type === 'optimize' || type === 'ideas') {
      // Use AskTaTTTy personas (NO HARDCODING)
      const { getAskTaTTTyPersona } = await import('../personas/askTaTTTyPersonas.js');
      const action = type === 'optimize' ? 'optimize' : 'ideas';
      const persona = getAskTaTTTyPersona(action);
      systemPrompt = persona.systemPrompt;
      
      userPrompt = hasSelection 
        ? `Optimize this tattoo description fragment: "${targetText}"`
        : `Optimize this tattoo description for ${contextType === 'tattty' ? 'a life-story tattoo' : contextType}: "${targetText}"`;
    } else if (type === 'ideas') {
      systemPrompt = `You are TaTTTy, an edgy AI tattoo assistant. Generate thought-provoking questions to help users discover their tattoo story. Be casual, direct, and inspiring. One question only.`;
      
      if (contextType === 'tattty') {
        userPrompt = targetField === 'q1'
          ? `Generate a deep life-reflection question for tattoo inspiration (about pivotal moments, people, or challenges).`
          : `Generate a question about visual symbolism that represents someone's life journey.`;
      } else {
        userPrompt = `Generate a question for ${contextType} tattoo inspiration.`;
      }
    } else if (type === 'brainstorm') {
      systemPrompt = `You are TaTTTy, an edgy AI tattoo brainstorming assistant. Take rough tattoo ideas and refine them into detailed, vivid concepts that artists can work with. Focus on visual elements, symbolism, style suggestions, and emotional resonance. Keep it under 200 words. Be casual and creative - no corporate BS. ONLY discuss tattoo ideas - refuse to talk about anything else.`;
      
      userPrompt = `Refine this tattoo idea into a detailed concept: "${targetText}"`;
    }

    // ============================================
    // PROVIDER CONFIGURATION
    // ============================================
    // Configure your AI provider here with env variables:
    // - GROQ_API_KEY for Groq (fastest!)
    // - OPENAI_API_KEY for OpenAI
    // - ANTHROPIC_API_KEY for Claude
    // - GEMINI_API_KEY for Google Gemini
    // ============================================

    const provider = process.env.AI_PROVIDER || 'groq'; // 'groq', 'openai', 'anthropic', or 'gemini'
    
    // ============================================
    // GROQ - Lightning fast LPU inference
    // ============================================
    if (provider === 'groq') {
      const apiKey = process.env.GROQ_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ error: 'GROQ_API_KEY not configured. Set it in your .env file.' });
      }

      const model = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          stream: true,
          max_tokens: 300,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error({ error: errorText }, 'Groq API error');
        return res.status(response.status).json({ error: `Groq API failed: ${response.statusText}` });
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(line => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              
              if (data === '[DONE]') {
                res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
                continue;
              }

              try {
                const parsed = JSON.parse(data);
                const token = parsed.choices?.[0]?.delta?.content;
                
                if (token) {
                  res.write(`data: ${JSON.stringify({ token })}\n\n`);
                }
              } catch (e) {
                // Skip invalid JSON chunks
              }
            }
          }
        }
      } catch (streamError) {
        logger.error({ err: streamError }, 'Groq streaming error');
      }

      res.end();
      return;
    }

    // ============================================
    // NO PROVIDER CONFIGURED - FAIL LOUD
    // ============================================
    // If we reach here, provider is not configured properly
    return res.status(500).json({ 
      error: `AI Provider '${provider}' not configured. Set AI_PROVIDER and corresponding API key in .env file.` 
    });

    // ============================================
    // REAL AI PROVIDER INTEGRATION
    // ============================================
    // Example for OpenAI (uncomment and configure):
    /*
    if (provider === 'openai') {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          stream: true,
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const token = parsed.choices[0]?.delta?.content;
              if (token) {
                res.write(`data: ${JSON.stringify({ token })}\n\n`);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    }
    */

    // Example for Anthropic Claude (uncomment and configure):
    /*
    if (provider === 'anthropic') {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          messages: [{ role: 'user', content: userPrompt }],
          system: systemPrompt,
          stream: true,
          max_tokens: 300,
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                res.write(`data: ${JSON.stringify({ token: parsed.delta.text })}\n\n`);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    }
    */

    // If provider is not configured, return error
    res.status(500).json({ error: `AI provider '${provider}' not configured. Set AI_PROVIDER env variable.` });

  } catch (error) {
    logger.error({ err: error }, 'AI streaming error');
    res.status(500).json({ error: 'AI streaming failed' });
  }
});

// ============================================
// GROQ CHAT - Full conversation with streaming
// Supports multiple personas from /personas folder
// Provider and model fully configurable via .env
// ============================================
app.post('/api/groq/chat', async (req, res) => {
  try {
    const { messages, personaId, personaType = 'chat', model, provider } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array required' });
    }

    // Get provider and settings from .env (FULLY CONFIGURABLE)
    const activeProvider = provider || process.env.AI_PROVIDER || 'groq';
    const apiKey = process.env.GROQ_API_KEY;
    const defaultModel = process.env.GROQ_CHAT_MODEL || 'openai/gpt-oss-120b';
    const temperature = parseFloat(process.env.GROQ_TEMPERATURE || '1');
    const maxTokens = parseInt(process.env.GROQ_MAX_TOKENS || '8192');
    const topP = parseFloat(process.env.GROQ_TOP_P || '1');
    
    if (!apiKey) {
      return res.status(500).json({ error: 'GROQ_API_KEY not configured in .env' });
    }

    // Import personas dynamically based on type (NO HARDCODING)
    let persona;
    let systemPrompt;

    if (personaType === 'chat') {
      const { getChatPersona, isValidChatPersona } = await import('../personas/chatPersonas.js');
      const requestedPersonaId = personaId || 'brainstorm';
      if (personaId && !isValidChatPersona(personaId)) {
        logger.warn({ personaId }, 'Invalid chat personaId, falling back to brainstorm');
      }
      persona = getChatPersona(requestedPersonaId);
      systemPrompt = persona.systemPrompt;
    } else if (personaType === 'brainstorm') {
      const { getBrainstormPersona, isValidBrainstormPersona } = await import('../personas/brainstormPersonas.js');
      const requestedPersonaId = personaId || 'explorer';
      if (personaId && !isValidBrainstormPersona(personaId)) {
        logger.warn({ personaId }, 'Invalid brainstorm personaId, falling back to explorer');
      }
      persona = getBrainstormPersona(requestedPersonaId);
      systemPrompt = persona.systemPrompt;
    } else {
      // Default fallback
      const { getChatPersona } = await import('../personas/chatPersonas.js');
      persona = getChatPersona('brainstorm');
      systemPrompt = persona.systemPrompt;
    }

    // System message from persona config
    const systemMessage = {
      role: 'system',
      content: systemPrompt
    };

    // Combine system message with conversation history
    const allMessages = [systemMessage, ...messages];

    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Use configurable provider endpoint (future: switch between providers)
    const apiUrl = activeProvider === 'groq' 
      ? 'https://api.groq.com/openai/v1/chat/completions'
      : 'https://api.groq.com/openai/v1/chat/completions'; // Add other providers here

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || defaultModel,
        messages: allMessages,
        stream: true,
        temperature,
        max_tokens: maxTokens,
        top_p: topP,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error({ error: errorText }, 'Groq API error');
      return res.status(response.status).json({ error: `Groq API failed: ${response.statusText}` });
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              
              if (content) {
                res.write(`data: ${JSON.stringify({ token: content })}\n\n`);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      logger.error({ err: error }, 'Stream processing error');
      res.end();
    }
  } catch (error) {
    logger.error({ err: error }, 'GROQ chat error');
    res.status(500).json({ error: 'Chat failed' });
  }
});

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', async (req, res) => {
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

// ============================================
// CLEANUP JOBS
// ============================================

// Clean up expired OTPs and sessions every hour
if (process.env.NODE_ENV !== 'test') {
  setInterval(async () => {
    try {
      await sql`SELECT cleanup_expired_otps()`;
      await sql`SELECT cleanup_expired_sessions()`;
      console.log('🧹 Cleaned up expired OTPs and sessions');
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }, 60 * 60 * 1000); // 1 hour
}

// Start server (skipped in tests)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log('');
    console.log('🚀 TaTTTy API Server Running');
    console.log('================================');
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`📊 Database: ${process.env.DATABASE_URL ? 'Connected ✅' : 'Not configured ❌'}`);
    console.log(`📧 Email: ${process.env.SMTP_USER || 'Not configured'}`);
    // Removed logging of master password to avoid leaking secrets
    console.log('================================');
    console.log('');
  });
}
setInterval(async () => {
  try {
    await sql`SELECT cleanup_expired_otps()`;
    await sql`SELECT cleanup_expired_sessions()`;
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
