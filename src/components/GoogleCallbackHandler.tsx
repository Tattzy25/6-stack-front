import { useEffect, useState } from 'react';
import { handleGoogleCallback } from '../utils/authApi';
import { DiamondLoader } from './shared/DiamondLoader';

interface GoogleCallbackHandlerProps {
  onNavigate: (page: string) => void;
  onAuthSuccess: (user: any) => void;
}

export function GoogleCallbackHandler({ onNavigate, onAuthSuccess }: GoogleCallbackHandlerProps) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      // Get authorization code from URL
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const errorParam = params.get('error');

      if (errorParam) {
        setError('Google sign-in was cancelled or failed');
        setTimeout(() => onNavigate('auth'), 3000);
        return;
      }

      if (!code) {
        setError('No authorization code received');
        setTimeout(() => onNavigate('auth'), 3000);
        return;
      }

      try {
        // Exchange code for user
        const user = await handleGoogleCallback(code);
        
        // Store user
        localStorage.setItem('tattty_user', JSON.stringify(user));
        
        // Call success handler
        onAuthSuccess(user);

        // Get return destination
        const returnTo = sessionStorage.getItem('oauth_return_to') || 'dashboard';
        sessionStorage.removeItem('oauth_return_to');

        // Redirect
        setTimeout(() => onNavigate(returnTo), 1000);
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setTimeout(() => onNavigate('auth'), 3000);
      }
    };

    handleCallback();
  }, [onNavigate, onAuthSuccess]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0C0C0D' }}>
      <div className="text-center">
        {error ? (
          <div className="space-y-4">
            <div className="text-red-400 text-xl">{error}</div>
            <div className="text-white/60">Redirecting back to sign in...</div>
          </div>
        ) : (
          <div className="space-y-4">
            <DiamondLoader />
            <div className="text-white/80 text-xl">Completing sign in...</div>
            <div className="text-white/60 text-sm">Please wait</div>
          </div>
        )}
      </div>
    </div>
  );
}
