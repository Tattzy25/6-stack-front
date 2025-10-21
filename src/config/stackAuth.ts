/**
 * Stack Auth Configuration
 *
 * Stack Auth handles OTP authentication with Neon database integration
 * Project: TaTTTy
 */

import { env } from '../utils/env';

const urls = {
  signIn: '/auth',
  afterSignIn: '/generate',
  afterSignUp: '/generate',
  afterSignOut: '/home',
} as const;

/**
 * Resolve Stack Auth configuration from the runtime environment.
 * Throws immediately when required values are missing so the app cannot boot with unsafe defaults.
 */
export function getStackConfig() {
  const projectId = env.stackProjectId;
  const publishableKey = env.stackPublishableClientKey;

  if (!projectId || !publishableKey) {
    throw new Error(
      'Stack Auth credentials not configured. Please set VITE_STACK_PROJECT_ID and VITE_STACK_PUBLISHABLE_CLIENT_KEY.'
    );
  }

  return {
    projectId,
    publishableClientKey: publishableKey,
    urls,
  } as const;
}

export const STACK_CONFIG = getStackConfig();
