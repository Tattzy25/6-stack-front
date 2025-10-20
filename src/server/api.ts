/**
 * Backend API Server for TaTTTy
 * Production-ready authentication with Neon database + RLS + Stack Auth
 * 
 * Features:
 * - Email OTP authentication via Stack Auth
 * - Google OAuth
 * - Master password backdoor (<MASTER_PASSCODE>)
 * - Row Level Security (RLS)
 * - UUIDs for all IDs
 * - 30-day sessions
 */

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';
import { sendOTPEmail, sendWelcomeEmail, testEmailConnection } from './emailService.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Stack Auth Configuration (Backend ONLY - NEVER expose to frontend)
const STACK_PROJECT_ID = process.env.STACK_PROJECT_ID;
const STACK_SECRET_KEY = process.env.STACK_SECRET_SERVER_KEY;

// Validate Stack Auth credentials on startup
if (!STACK_PROJECT_ID || !STACK_SECRET_KEY) {
  console.warn('⚠️  Stack Auth credentials not configured. OTP will fall back to dev mode.');
  console.warn('   Set STACK_PROJECT_ID and STACK_SECRET_SERVER_KEY in your .env file');
}

// Master backdoor password (for emergency admin access)
const MASTER_PASSWORD = process.env.MASTER_PASSWORD || '';

// Database connection
const sql = neon(process.env.DATABASE_URL || '');

// Middleware
app.use(cors({
  origin: process.env.APP_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// ==========================================
// EXAMPLE IMAGES ROUTES
// ==========================================

// Get random examples
app.get('/api/examples/random', async (req, res) => {
  const { category, limit = '6' } = req.query;
  
  try {
    const results = await sql`
      SELECT * FROM get_random_examples(
        ${category || null}::VARCHAR,
        ${parseInt(limit)}::INTEGER
      )
    `;
    
    res.json({ 
      success: true, 
      examples: results,
      count: results.length 
    });
  } catch (error) {
    console.error('Error fetching random examples:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch examples',
      examples: []
    });
  }
});

// Get featured examples
app.get('/api/examples/featured', async (req, res) => {
  try {
    const results = await sql`
      SELECT * FROM get_featured_examples()
    `;
    
    res.json({ 
      success: true, 
      examples: results,
      count: results.length 
    });
  } catch (error) {
    console.error('Error fetching featured examples:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch featured examples',
      examples: []
    });
  }
});

// Get examples by category
app.get('/api/examples', async (req, res) => {
  const { category, limit } = req.query;
  
  try {
    let results;
    
    if (category) {
      results = await sql`
        SELECT 
          id, title, description, image_url, thumbnail_url,
          category, style, tags, is_featured, display_order
        FROM example_images
        WHERE is_active = TRUE AND category = ${category}
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
    
    if (limit) {
      results = results.slice(0, parseInt(limit));
    }
    
    res.json({ 
      success: true, 
      examples: results,
      count: results.length 
    });
  } catch (error) {
    console.error('Error fetching examples:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch examples',
      examples: []
    });
  }
});

// Increment view count
app.post('/api/examples/:id/view', async (req, res) => {
  const { id } = req.params;
  
  try {
    await sql`
      UPDATE example_images 
      SET view_count = view_count + 1 
      WHERE id = ${id}
    `;
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error incrementing view count:', error);
    res.status(500).json({ success: false });
  }
});

// Test email connection on startup
testEmailConnection()
  .then(() => console.log('✅ Email service connected'))
  .catch(() => console.warn('⚠️  Email service unavailable - OTPs will log to console'));

// ============================================
// HELPER FUNCTIONS
// ============================================

// Generate random 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
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
app.post('/api/auth/otp/send', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    // Generate OTP
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database
    await sql`
      INSERT INTO otp_codes (email, code, expires_at)
      VALUES (${email}, ${code}, ${expiresAt})
    `;

    // Send OTP email
    const emailSent = await sendOTPEmail(email, code);

    console.log(`📧 OTP sent to ${email}: ${code} (expires in 10 min)`);

    res.json({ 
      success: true, 
      message: emailSent 
        ? 'OTP sent to your email' 
        : 'OTP generated (check server console in dev mode)',
      // Include code in response for dev mode (console fallback)
      ...(process.env.NODE_ENV === 'development' && { code })
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

/**
 * POST /api/auth/otp/verify
 * Verify OTP and create session
 * Also handles master password backdoor
 */
app.post('/api/auth/otp/verify', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: 'Email and code required' });
    }

    let user: any;
    let isMasterAccess = false;

    // Check if using master password
    if (code === MASTER_PASSWORD) {
      console.log(`🔓 Master password used for: ${email}`);
      isMasterAccess = true;

      // Get or create admin user
      user = await sql`
        SELECT * FROM users WHERE email = ${email}
      `.then(r => r[0]);

      if (!user) {
        const newUsers = await sql`
          INSERT INTO users (email, email_verified, provider, role, is_master_user)
          VALUES (${email}, true, 'email', 'admin', true)
          RETURNING *
        `;
        user = newUsers[0];

        // Create user profile
        await sql`
          INSERT INTO user_profiles (user_id)
          VALUES (${user.id})
          ON CONFLICT (user_id) DO NOTHING
        `;

        console.log(`👑 Created new admin user: ${email}`);
      } else {
        // Upgrade existing user to admin if using master password
        await sql`
          UPDATE users
          SET role = 'admin', is_master_user = true, email_verified = true
          WHERE id = ${user.id}
        `;
        console.log(`👑 Upgraded user to admin: ${email}`);
      }
    } else {
      // Regular OTP verification
      const otpResult = await sql`
        SELECT * FROM otp_codes
        WHERE email = ${email}
        AND code = ${code}
        AND expires_at > NOW()
        AND used = false
        ORDER BY created_at DESC
        LIMIT 1
      `;

      if (otpResult.length === 0) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }

      // Mark OTP as used
      await sql`
        UPDATE otp_codes
        SET used = true
        WHERE id = ${otpResult[0].id}
      `;

      // Get or create user
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

        // Create user profile
        await sql`
          INSERT INTO user_profiles (user_id)
          VALUES (${user.id})
          ON CONFLICT (user_id) DO NOTHING
        `;

        // Send welcome email (don't await - send in background)
        sendWelcomeEmail(email, user.name).catch(err => 
          console.error('Failed to send welcome email:', err)
        );

        console.log(`🎉 New user signup: ${email}`);
      }
    }

    // Update last login and increment login count
    await sql`
      UPDATE users
      SET last_login_at = NOW(),
          login_count = login_count + 1
      WHERE id = ${user.id}
      RETURNING *
    `.then(r => { user = r[0]; });

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
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    console.log(`✅ Login successful: ${email} (${user.role}${isMasterAccess ? ' - MASTER ACCESS' : ''})`);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar_url,
        role: user.role,
        isMasterUser: user.is_master_user,
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
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
        isMasterUser: user.is_master_user,
      },
    });
  } catch (error) {
    console.error('Session check error:', error);
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
      console.log(`👋 User signed out`);
    }

    res.clearCookie('session_token');
    res.json({ success: true });
  } catch (error) {
    console.error('Sign out error:', error);
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
      console.error('Google token exchange failed:', error);
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
    let user = await sql`
      SELECT * FROM users 
      WHERE provider = 'google' 
      AND provider_id = ${googleUser.id}
    `.then(r => r[0]);

    if (!user) {
      // Check if email already exists
      user = await sql`
        SELECT * FROM users WHERE email = ${googleUser.email}
      `.then(r => r[0]);

      if (user) {
        // Update existing user with Google OAuth
        await sql`
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
        `.then(r => { user = r[0]; });
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
        user = newUsers[0];

        // Create user profile
        await sql`
          INSERT INTO user_profiles (user_id)
          VALUES (${user.id})
          ON CONFLICT (user_id) DO NOTHING
        `;

        console.log(`🎉 New Google user: ${googleUser.email}`);
      }
    } else {
      // Update last login
      await sql`
        UPDATE users
        SET last_login_at = NOW(),
            login_count = login_count + 1
        WHERE id = ${user.id}
        RETURNING *
      `.then(r => { user = r[0]; });
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
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    console.log(`✅ Google login successful: ${user.email} (${user.role})`);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar_url,
        role: user.role,
        isMasterUser: user.is_master_user,
      },
    });
  } catch (error) {
    console.error('Google OAuth callback error:', error);
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

    const { sql: query, params } = req.body;

    // Execute query
    const result = await sql(query, params);

    res.json({
      rows: result,
      rowCount: result.length,
    });
  } catch (error) {
    console.error('Database query error:', error);
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
        console.error('Groq API error:', errorText);
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
        console.error('Groq streaming error:', streamError);
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
    console.error('AI streaming error:', error);
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
        console.warn(`Invalid chat personaId: ${personaId}, falling back to brainstorm`);
      }
      persona = getChatPersona(requestedPersonaId);
      systemPrompt = persona.systemPrompt;
    } else if (personaType === 'brainstorm') {
      const { getBrainstormPersona, isValidBrainstormPersona } = await import('../personas/brainstormPersonas.js');
      const requestedPersonaId = personaId || 'explorer';
      if (personaId && !isValidBrainstormPersona(personaId)) {
        console.warn(`Invalid brainstorm personaId: ${personaId}, falling back to explorer`);
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
      console.error('Groq API error:', errorText);
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
      console.error('Stream processing error:', error);
      res.end();
    }
  } catch (error) {
    console.error('GROQ chat error:', error);
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
setInterval(async () => {
  try {
    const otpResult = await sql`SELECT cleanup_expired_otps()`;
    const sessionResult = await sql`SELECT cleanup_expired_sessions()`;
    console.log('🧹 Cleaned up expired OTPs and sessions');
  } catch (error) {
    console.error('Cleanup error:', error);
  }
}, 60 * 60 * 1000); // 1 hour

// Start server
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

export default app;
