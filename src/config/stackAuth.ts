/**
 * Stack Auth Configuration
 *
 * Stack Auth handles OTP authentication with Neon database integration
 * Project: TaTTTy
 */

import { env } from '../utils/env';

export const STACK_CONFIG = {
  projectId: '<STACK_PROJECT_ID>',
  publishableClientKey: '<STACK_PUBLISHABLE_CLIENT_KEY>',

  // Frontend URLs (auto-detected in most cases)
  urls: {
    signIn: '/auth',
    afterSignIn: '/generate',
    afterSignUp: '/generate',
    afterSignOut: '/home',
  },
} as const;

/**
 * Get Stack Auth configuration from environment or fallback to defaults
 */
export function getStackConfig() {
  const projectId = env.stackProjectId || STACK_CONFIG.projectId;
  const publishableKey = env.stackPublishableClientKey || STACK_CONFIG.publishableClientKey;

  if (!projectId || !publishableKey) {
    throw new Error(
      'Stack Auth credentials not configured. Please set VITE_STACK_PROJECT_ID and VITE_STACK_PUBLISHABLE_CLIENT_KEY.'
    );
  }

  return {
    projectId,
    publishableClientKey: publishableKey,
    urls: STACK_CONFIG.urls,
  };
}
