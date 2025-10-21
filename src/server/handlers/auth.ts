import { Request, Response } from 'express';
import { createDatabaseClient } from '../database.js';
import { generateOTP, asRows } from '../utils/helpers.js';
import { otpSendSchema, otpVerifySchema } from '../schemas/validation.js';
import { sendWelcomeEmail } from '../emailService.js';
import pino from 'pino';
import { appConfig } from '../config.js';

const sql = createDatabaseClient();
const logger = pino({ level: appConfig.logLevel });

// Email service override support
const emailService = {
  sendOTPEmail: (globalThis as any).__TATTY_SERVER_OVERRIDES__?.sendOTPEmail ?? require('../emailService.js').sendOTPEmail,
  sendWelcomeEmail: (globalThis as any).__TATTY_SERVER_OVERRIDES__?.sendWelcomeEmail ?? sendWelcomeEmail,
  testEmailConnection: (globalThis as any).__TATTY_SERVER_OVERRIDES__?.testEmailConnection ?? require('../emailService.js').testEmailConnection,
};

// Send OTP
export async function sendOTP(req: Request, res: Response): Promise<void> {
  const parsed = otpSendSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid email address' });
    return;
  }

  const { email } = parsed.data;

  try {
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await sql`
      INSERT INTO otp_codes (email, code, expires_at)
      VALUES (${email}, ${code}, ${expiresAt})
    `;

    const emailSent = await emailService.sendOTPEmail(email, code);

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
}

// Verify OTP and create session
export async function verifyOTP(req: Request, res: Response): Promise<void> {
  const parsed = otpVerifySchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ message: 'Email and code required' });
    return;
  }

  const { email, code } = parsed.data;

  try {
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
      res.status(400).json({ message: 'Invalid or expired OTP' });
      return;
    }

    await sql`
      UPDATE otp_codes
      SET used = true
      WHERE id = ${otpResult[0].id}
    `;

    // Get or create user
    let user = await sql`
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

      // Send welcome email
      emailService.sendWelcomeEmail(email, user.name).catch(err =>
        logger.error({ err }, 'Failed to send welcome email')
      );

      logger.info({ email }, 'New user signup');
    }

    // Update last login and increment login count
    const updatedUser = await sql`
      UPDATE users
      SET last_login_at = NOW(),
          login_count = login_count + 1
      WHERE id = ${user.id}
      RETURNING *
    `;
    user = asRows(updatedUser)[0] ?? user;

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
}
