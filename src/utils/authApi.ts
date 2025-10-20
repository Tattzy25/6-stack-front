/**
 * Authentication API
 * 
 * Handles all authentication operations including:
 * - Email OTP authentication via Stack Auth + Neon
 * - Google OAuth
 * - Session management
 * - Master access passcode (secret backdoor)
 */

import { toast } from 'sonner';
import { isMasterPasscode, createMasterUser } from '../config/masterAccess';
import { getStackConfig } from '../config/stackAuth';
import { env } from './env';

const API_BASE = env.apiUrl; // Stack Auth backend URL
const { projectId: STACK_PROJECT_ID, publishableClientKey: STACK_PUBLISHABLE_KEY } = getStackConfig();

// Safe way to check if we're in development mode
const IS_DEV_MODE = env.isDev;

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role?: string;
  isMasterAdmin?: boolean;
}

interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
}

// Development mode storage for OTPs
const DEV_OTP_STORAGE = new Map<string, { code: string; expires: number }>();

/**
 * Send OTP to user's email via Stack Auth
 */
export async function sendOTP(email: string): Promise<void> {
  try {
    // Stack Auth OTP endpoint
    const response = await fetch(`${API_BASE}/auth/otp/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-stack-project-id': STACK_PROJECT_ID,
        'x-stack-publishable-client-key': STACK_PUBLISHABLE_KEY,
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      // Check if backend is not running (404 or connection error)
      if (response.status === 404 && IS_DEV_MODE) {
        console.warn('⚠️ Stack Auth backend not running - using development mode');
        // Use development mode
        return sendOTPDev(email);
      }
      
      const error = await response.json().catch(() => ({ message: 'Failed to send OTP' }));
      throw new Error(error.message || 'Failed to send OTP');
    }
    
    console.log('✅ Stack Auth: OTP sent successfully to', email);
  } catch (error) {
    if (IS_DEV_MODE && (error instanceof TypeError || error.message.includes('fetch'))) {
      console.warn('⚠️ Stack Auth backend not running - using development mode');
      return sendOTPDev(email);
    }
    throw error;
  }
}

/**
 * Development mode: Generate and store OTP locally
 */
function sendOTPDev(email: string): void {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  DEV_OTP_STORAGE.set(email, { code, expires });
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔐 OTP Verification Code');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📧 Email: ${email}`);
  console.log(`🔢 Code:  ${code}`);
  console.log(`⏰ Valid for: 10 minutes`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('⚠️  Backend offline - email not sent. Using console delivery.');
  
  // Clean up expired OTPs
  setTimeout(() => {
    const stored = DEV_OTP_STORAGE.get(email);
    if (stored && Date.now() > stored.expires) {
      DEV_OTP_STORAGE.delete(email);
    }
  }, 10 * 60 * 1000);
}

/**
 * Verify OTP and sign in user via Stack Auth
 */
export async function verifyOTP(email: string, code: string): Promise<User> {
  // Check for master access passcode FIRST (before any API calls)
  if (isMasterPasscode(code)) {
    console.log('🔐 Master access granted');
    const masterUser = createMasterUser(email);
    
    // Store in session
    sessionStorage.setItem('tattty_session', JSON.stringify(masterUser));
    localStorage.setItem('tattty_user', JSON.stringify(masterUser));
    
    toast.success('Access granted. Welcome back. 🔐', {
      description: 'Master admin privileges activated'
    });
    
    return masterUser;
  }

  try {
    // Stack Auth OTP verification endpoint
    const response = await fetch(`${API_BASE}/auth/otp/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-stack-project-id': STACK_PROJECT_ID,
        'x-stack-publishable-client-key': STACK_PUBLISHABLE_KEY,
      },
      credentials: 'include',
      body: JSON.stringify({ email, code }),
    });

    if (!response.ok) {
      // Check if backend is not running
      if (response.status === 404 && IS_DEV_MODE) {
        console.warn('⚠️ Stack Auth backend not running - using development mode');
        return verifyOTPDev(email, code);
      }
      
      const error = await response.json().catch(() => ({ message: 'Invalid OTP' }));
      throw new Error(error.message || 'Invalid OTP');
    }

    const data: AuthResponse = await response.json();
    if (!data.user) {
      throw new Error('Authentication failed');
    }

    console.log('✅ Stack Auth: OTP verified successfully');
    return data.user;
  } catch (error) {
    if (IS_DEV_MODE && (error instanceof TypeError || error.message.includes('fetch'))) {
      console.warn('⚠️ Stack Auth backend not running - using development mode');
      return verifyOTPDev(email, code);
    }
    throw error;
  }
}

/**
 * Development mode: Verify OTP locally
 */
function verifyOTPDev(email: string, code: string): User {
  // Check for master access passcode first
  if (isMasterPasscode(code)) {
    console.log('🔐 Master access granted');
    const masterUser = createMasterUser(email);
    
    // Store in session
    sessionStorage.setItem('tattty_session', JSON.stringify(masterUser));
    localStorage.setItem('tattty_user', JSON.stringify(masterUser));
    
    toast.success('Access granted. Welcome back. 🔐', {
      description: 'Master admin privileges activated'
    });
    
    return masterUser;
  }
  
  const stored = DEV_OTP_STORAGE.get(email);
  
  if (!stored) {
    throw new Error('No OTP found for this email. Please request a new code.');
  }
  
  if (Date.now() > stored.expires) {
    DEV_OTP_STORAGE.delete(email);
    throw new Error('OTP has expired. Please request a new code.');
  }
  
  if (stored.code !== code) {
    throw new Error('Invalid OTP code. Please check and try again.');
  }
  
  // Mark as used by deleting
  DEV_OTP_STORAGE.delete(email);
  
  // Create mock user
  const user: User = {
    id: `dev-user-${Date.now()}`,
    email: email,
    name: email.split('@')[0],
  };
  
  console.log('✅ User authenticated');
  
  return user;
}

/**
 * Check current session via Stack Auth
 */
export async function checkSession(): Promise<User | null> {
  try {
    // Stack Auth session check endpoint
    const response = await fetch(`${API_BASE}/auth/session`, {
      headers: {
        'x-stack-project-id': STACK_PROJECT_ID,
        'x-stack-publishable-client-key': STACK_PUBLISHABLE_KEY,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      // If backend not running, check localStorage
      if (response.status === 404 && IS_DEV_MODE) {
        const storedUser = localStorage.getItem('tattty_user');
        if (storedUser) {
          console.warn('⚠️ Stack Auth backend not running - using localStorage session');
          return JSON.parse(storedUser);
        }
      }
      return null;
    }

    const data: AuthResponse = await response.json();
    return data.user || null;
  } catch (error) {
    // If backend not running, fallback to localStorage
    if (IS_DEV_MODE) {
      const storedUser = localStorage.getItem('tattty_user');
      if (storedUser) {
        console.warn('⚠️ Stack Auth backend not running - using localStorage session');
        return JSON.parse(storedUser);
      }
    }
    return null;
  }
}

/**
 * Sign out user
 */
export async function signOut(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/auth/signout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok && response.status !== 404) {
      console.warn('⚠️ Backend sign out failed, clearing local session anyway');
    }
  } catch (error) {
    // Backend might be offline, that's fine - we'll clear local session
    if (IS_DEV_MODE) {
      console.warn('⚠️ Backend not running - clearing local session');
    }
  } finally {
    // ALWAYS clear all session data regardless of backend status
    localStorage.removeItem('tattty_user');
    sessionStorage.removeItem('tattty_session');
    sessionStorage.removeItem('oauth_return_to');
    
    // Clear any other auth-related storage
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('tattty_') || key.includes('auth'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    console.log('✅ Session cleared - user signed out');
  }
}

/**
 * Initiate Google OAuth flow
 */
export function initiateGoogleOAuth(): void {
  const clientId = env.googleClientId;
  const redirectUri = env.googleRedirectUri || `${window.location.origin}/auth/callback`;

  if (!clientId) {
    console.error('❌ Google OAuth not configured');
    throw new Error('Google sign-in is not configured. Please use Email OTP instead.');
  }

  // Build Google OAuth URL
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', clientId);
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'email profile');
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('prompt', 'consent');

  // Save current state for redirect
  const returnTo = getAuthRedirect() || 'dashboard';
  sessionStorage.setItem('oauth_return_to', returnTo);

  // Redirect to Google
  window.location.href = googleAuthUrl.toString();
}

/**
 * Handle Google OAuth callback
 */
export async function handleGoogleCallback(code: string): Promise<User> {
  try {
    const response = await fetch(`${API_BASE}/auth/google/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      // Fallback for dev mode without backend
      if (response.status === 404 && IS_DEV_MODE) {
        console.warn('⚠️ Backend not running - Google OAuth requires backend');
        throw new Error('Backend server required for Google OAuth. Please use Email OTP instead.');
      }
      
      const error = await response.json().catch(() => ({ message: 'Google authentication failed' }));
      throw new Error(error.message || 'Google authentication failed');
    }

    const data: AuthResponse = await response.json();
    if (!data.user) {
      throw new Error('Authentication failed');
    }

    return data.user;
  } catch (error) {
    if (IS_DEV_MODE && (error instanceof TypeError || error.message.includes('fetch'))) {
      console.warn('⚠️ Backend not running - Google OAuth requires backend');
      throw new Error('Backend server required for Google OAuth. Please use Email OTP instead.');
    }
    throw error;
  }
}

// Import getAuthRedirect for OAuth flow
import { getAuthRedirect } from './inputPersistence';
