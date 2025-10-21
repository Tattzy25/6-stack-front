import crypto from 'crypto';

// Generate random 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function asRows<T = any>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

// Generate session token
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
