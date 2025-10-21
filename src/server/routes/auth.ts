import express from 'express';
import { otpRequestLimiter, otpVerifyLimiter } from '../middleware/rateLimiters.js';
import {
  sendOTP,
  verifyOTP
} from '../handlers/auth.js';
import {
  checkSession,
  signOut,
  googleOAuthCallback
} from '../handlers/authSession.js';

const router = express.Router();

// OTP routes
router.post('/api/auth/otp/send', otpRequestLimiter, sendOTP);
router.post('/api/auth/otp/verify', otpVerifyLimiter, verifyOTP);

// Session routes
router.get('/api/auth/session', checkSession);
router.post('/api/auth/signout', signOut);

// Google OAuth route
router.post('/api/auth/google/callback', googleOAuthCallback);

export default router;
