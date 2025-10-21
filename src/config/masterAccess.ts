/**
 * Master access override (temporary).
 *
 * Allows signing in by entering a single master OTP code with ANY email.
 * The code is provided via `VITE_MASTER_CODE` in your `.env`.
 *
 * SECURITY WARNING: This is for emergency/dev use only. Disable or remove
 * in production by omitting `VITE_MASTER_CODE`.
 */

import { env } from '../utils/env';

/** Returns true if a master code is configured and matches the input. */
export function isMasterPasscode(input: string): boolean {
  const master = (env as any).masterCode as string | undefined;
  if (!master) return false;
  return input.trim() === master.trim();
}

/** Creates a privileged user object for master access sign-in. */
export function createMasterUser(email: string) {
  const name = email?.split?.('@')?.[0] || 'master';
  return {
    id: `master-${Date.now()}`,
    email,
    name,
    role: 'admin',
    isAdmin: true,
    avatar: undefined,
  };
}

/** Quick flag you can check if needed elsewhere. */
export const masterAccess = Object.freeze({
  isEnabled: Boolean((env as any).masterCode),
});
