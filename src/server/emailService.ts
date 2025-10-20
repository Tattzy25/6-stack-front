/**
 * Email Service for TaTTTy
 * Handles sending OTP codes and other transactional emails
 */

import nodemailer from 'nodemailer';

// SMTP Configuration from environment
const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp-relay.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

const FROM_EMAIL = process.env.SMTP_FROM_EMAIL || 'noreply@tattty.com';
const FROM_NAME = process.env.SMTP_FROM_NAME || 'TaTTTy';

// Create reusable transporter
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('⚠️ SMTP credentials not configured. Emails will only be logged to console.');
      return null;
    }

    transporter = nodemailer.createTransport(SMTP_CONFIG);
    console.log('📧 Email service initialized');
  }
  return transporter;
}

/**
 * Send OTP email
 */
export async function sendOTPEmail(email: string, code: string): Promise<boolean> {
  const transport = getTransporter();

  // Development mode: Just log to console
  if (!transport || process.env.NODE_ENV === 'development') {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 OTP Email (Dev Mode - Not Sent)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`To: ${email}`);
    console.log(`Code: ${code}`);
    console.log('Expires in 10 minutes');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return true;
  }

  try {
    const info = await transport.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: email,
      subject: 'Your TaTTTy Verification Code',
      html: getOTPEmailTemplate(code),
      text: getOTPEmailText(code),
    });

    console.log(`✅ OTP email sent to ${email} - Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send OTP email:', error);
    
    // Fallback: Log to console in case of email failure
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 OTP Email (Fallback - Email Failed)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`To: ${email}`);
    console.log(`Code: ${code}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return false;
  }
}

/**
 * Send welcome email after user signs up
 */
export async function sendWelcomeEmail(email: string, name?: string): Promise<boolean> {
  const transport = getTransporter();
  
  if (!transport) {
    console.log(`📧 Welcome email would be sent to ${email}`);
    return true;
  }

  try {
    await transport.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: email,
      subject: 'Welcome to TaTTTy! 🎨',
      html: getWelcomeEmailTemplate(name || 'there'),
      text: getWelcomeEmailText(name || 'there'),
    });

    console.log(`✅ Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    return false;
  }
}

/**
 * Test SMTP connection
 */
export async function testEmailConnection(): Promise<boolean> {
  const transport = getTransporter();
  
  if (!transport) {
    console.log('⚠️ SMTP not configured - skipping connection test');
    return false;
  }

  try {
    await transport.verify();
    console.log('✅ SMTP connection verified');
    return true;
  } catch (error) {
    console.error('❌ SMTP connection failed:', error);
    return false;
  }
}

// ============================================
// EMAIL TEMPLATES
// ============================================

function getOTPEmailTemplate(code: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your TaTTTy Verification Code</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #0C0C0D;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #1a1a1b;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }
    .header {
      background: linear-gradient(135deg, #0C0C0D 0%, #1a1a1b 100%);
      padding: 40px 30px;
      text-align: center;
      border-bottom: 2px solid #57f1d6;
    }
    .logo {
      color: #57f1d6;
      font-size: 32px;
      font-weight: bold;
      margin: 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }
    .content {
      padding: 40px 30px;
      color: #e0e0e0;
    }
    .code-container {
      background: #0C0C0D;
      border: 2px solid #57f1d6;
      border-radius: 8px;
      padding: 30px;
      margin: 30px 0;
      text-align: center;
    }
    .code {
      font-size: 36px;
      font-weight: bold;
      color: #57f1d6;
      letter-spacing: 8px;
      margin: 0;
      text-shadow: 0 0 10px rgba(87, 241, 214, 0.3);
    }
    .expires {
      color: #999;
      font-size: 14px;
      margin-top: 15px;
    }
    .footer {
      background: #0C0C0D;
      padding: 30px;
      text-align: center;
      color: #666;
      font-size: 14px;
      border-top: 1px solid #333;
    }
    .button {
      display: inline-block;
      background: #57f1d6;
      color: #0C0C0D;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      margin: 20px 0;
    }
    .divider {
      height: 1px;
      background: #333;
      margin: 30px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo">TaTTTy</h1>
      <p style="color: #999; margin: 10px 0 0 0;">Your Story, Your Ink</p>
    </div>
    
    <div class="content">
      <h2 style="color: #57f1d6; margin-top: 0;">Your Verification Code</h2>
      
      <p style="font-size: 16px;">Hey there! 👋</p>
      
      <p>Use this code to complete your sign-in:</p>
      
      <div class="code-container">
        <div class="code">${code}</div>
        <div class="expires">⏰ Expires in 10 minutes</div>
      </div>
      
      <p style="color: #999; font-size: 14px;">
        If you didn't request this code, you can safely ignore this email.
      </p>
      
      <div class="divider"></div>
      
      <p style="font-size: 14px; color: #666;">
        Having trouble? Just reply to this email and we'll help you out.
      </p>
    </div>
    
    <div class="footer">
      <p style="margin: 0 0 10px 0;">TaTTTy - AI-Powered Tattoo Design</p>
      <p style="margin: 0; font-size: 12px;">
        © ${new Date().getFullYear()} TaTTTy. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

function getOTPEmailText(code: string): string {
  return `
TaTTTy - Your Verification Code

Hey there! 👋

Your verification code is: ${code}

This code will expire in 10 minutes.

If you didn't request this code, you can safely ignore this email.

━━━━━━━━━━━━━━━━━━
TaTTTy - Your Story, Your Ink
© ${new Date().getFullYear()} TaTTTy
  `.trim();
}

function getWelcomeEmailTemplate(name: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to TaTTTy!</title>
  <style>
    body { font-family: Arial, sans-serif; background: #0C0C0D; color: #e0e0e0; }
    .container { max-width: 600px; margin: 40px auto; background: #1a1a1b; border-radius: 12px; }
    .header { background: linear-gradient(135deg, #0C0C0D, #1a1a1b); padding: 40px; text-align: center; border-bottom: 2px solid #57f1d6; }
    .logo { color: #57f1d6; font-size: 32px; font-weight: bold; }
    .content { padding: 40px; }
    h2 { color: #57f1d6; }
    .feature { margin: 20px 0; padding-left: 30px; position: relative; }
    .feature:before { content: '✓'; color: #57f1d6; position: absolute; left: 0; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">TaTTTy</div>
    </div>
    <div class="content">
      <h2>Welcome, ${name}! 🎨</h2>
      <p>Thanks for joining TaTTTy! You're about to create some amazing tattoo designs.</p>
      
      <h3 style="color: #57f1d6;">What you can do:</h3>
      <div class="feature">Generate unique designs from your stories</div>
      <div class="feature">Create matching couples tattoos</div>
      <div class="feature">Design custom cover-ups</div>
      <div class="feature">Extend existing tattoos</div>
      
      <p style="margin-top: 30px;">Ready to start? Head over to your dashboard and begin creating!</p>
    </div>
  </div>
</body>
</html>
  `;
}

function getWelcomeEmailText(name: string): string {
  return `
Welcome to TaTTTy, ${name}! 🎨

Thanks for joining! You're about to create some amazing tattoo designs.

What you can do:
✓ Generate unique designs from your stories
✓ Create matching couples tattoos
✓ Design custom cover-ups
✓ Extend existing tattoos

Ready to start? Head over to your dashboard and begin creating!

━━━━━━━━━━━━━━━━━━
TaTTTy - Your Story, Your Ink
  `.trim();
}
