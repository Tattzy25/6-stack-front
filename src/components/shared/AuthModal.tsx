import { useState, useEffect } from 'react';
import { X, Mail, Sparkles } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { useAuth } from '../../contexts/AuthContext';

// Simple Google Icon SVG
function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

interface AuthModalProps {
  onClose: () => void;
}

export function AuthModal({ onClose }: AuthModalProps) {
  const { isAuthenticated, isLoading, signInWithGoogle, signInWithOTP, verifyOTP } = useAuth();

  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Close modal if user is authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      onClose();
    }
  }, [isAuthenticated, isLoading, onClose]);

  const handleSendOTP = async () => {
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await signInWithOTP(email);
      setOtpSent(true);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await verifyOTP(email, otp);
      // Auth success - modal will close automatically when isAuthenticated changes
    } catch (err: any) {
      setError(err.message || 'Invalid verification code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      await signInWithGoogle();
      // Auth success - modal will close automatically when isAuthenticated changes
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
      >
        <X size={32} />
      </button>

      {/* Auth Card */}
      <Card
        className="w-full max-w-md bg-[#0C0C0D]/95 border-accent/30 relative overflow-hidden"
        style={{
          borderRadius: '24px',
          boxShadow: '0 0 60px rgba(87, 241, 214, 0.3)',
        }}
      >
        <CardContent className="p-8 space-y-6">
          {/* Friendly Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
              <Sparkles className="text-accent" size={32} />
            </div>
            <h2 className="text-white text-2xl font-[Orbitron]" style={{ letterSpacing: '1px' }}>
              Don't Worry!
            </h2>
            <p className="text-white/70">
              Your work is safe. Sign in to generate your tattoo design.
            </p>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GoogleIcon size={20} />
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0C0C0D] px-2 text-white/50">Or use email</span>
            </div>
          </div>

          {/* Email OTP */}
          {!otpSent ? (
            <div className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-accent/50 transition-all"
                disabled={isLoading}
              />
              <button
                onClick={handleSendOTP}
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-accent/80 to-accent text-background font-[Orbitron] rounded-xl transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(87,241,214,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  boxShadow: '0 0 15px rgba(87, 241, 214, 0.4)',
                  letterSpacing: '1px',
                }}
              >
                <Mail size={20} />
                <span>{isLoading ? 'SENDING...' : 'SEND CODE'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-white/70 text-sm">
                  We sent a code to <span className="text-accent">{email}</span>
                </p>
                <button
                  onClick={() => {
                    setOtpSent(false);
                    setOtp('');
                    setError('');
                  }}
                  className="text-accent/70 hover:text-accent text-sm transition-colors"
                >
                  Change email
                </button>
              </div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleVerifyOTP()}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-accent/50 transition-all text-center tracking-widest"
                maxLength={6}
                disabled={isLoading}
              />
              <button
                onClick={handleVerifyOTP}
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-accent/80 to-accent text-background font-[Orbitron] rounded-xl transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(87,241,214,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  boxShadow: '0 0 15px rgba(87, 241, 214, 0.4)',
                  letterSpacing: '1px',
                }}
              >
                <Sparkles size={20} />
                <span>{isLoading ? 'VERIFYING...' : 'VERIFY & GENERATE'}</span>
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Benefits */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <p className="text-white/50 text-xs text-center">
              ✨ Get 500 free tokens on signup
            </p>
            <p className="text-white/50 text-xs text-center">
              🎨 Save your designs to your dashboard
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
