import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as authApi from '../utils/authApi';
import { STACK_CONFIG } from '../config/stackAuth';

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role?: string;
  isMasterAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithOTP: (email: string) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    checkSession();
  }, []);

  const checkSession = async () => {
    setIsLoading(true);
    try {
      // Try Stack Auth session first
      const sessionUser = await authApi.checkSession();
      if (sessionUser) {
        setUser(sessionUser);
        // Also store in localStorage as backup
        localStorage.setItem('tattty_user', JSON.stringify(sessionUser));
      } else {
        // Check localStorage as fallback
        const storedUser = localStorage.getItem('tattty_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }
    } catch (error) {
      console.error('Session check failed:', error);
      // Try localStorage as fallback
      const storedUser = localStorage.getItem('tattty_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Initiate Google OAuth flow via Stack Auth
      authApi.initiateGoogleOAuth();
      // The OAuth flow will redirect back to the app
    } catch (error) {
      console.error('Google sign-in failed:', error);
      throw error;
    }
  };

  const signInWithOTP = async (email: string) => {
    try {
      // Stack Auth handles OTP sending via Neon
      await authApi.sendOTP(email);
    } catch (error) {
      console.error('OTP request failed:', error);
      throw error;
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      // Stack Auth verifies OTP and creates session
      const user = await authApi.verifyOTP(email, otp);
      setUser(user);
      localStorage.setItem('tattty_user', JSON.stringify(user));
    } catch (error) {
      console.error('OTP verification failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authApi.signOut();
      localStorage.removeItem('tattty_user');
      setUser(null);
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signInWithGoogle,
        signInWithOTP,
        verifyOTP,
        signOut,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
