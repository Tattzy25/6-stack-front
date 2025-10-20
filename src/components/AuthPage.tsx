import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getAuthRedirect, clearAuthRedirect, getFreestyleInput } from '../utils/inputPersistence';
import { toast } from 'sonner@2.0.3';
import { ArrowLeft } from 'lucide-react';

interface AuthPageProps {
  onNavigate: (page: string) => void;
}

export function AuthPage({ onNavigate }: AuthPageProps) {
  const { signInWithGoogle, signInWithOTP, verifyOTP } = useAuth();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      handleAuthSuccess();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Google sign-in failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await signInWithOTP(email);
      setOtpSent(true);
      toast.success('Verification code sent!', {
        description: 'Check your email for the 6-digit code'
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send OTP. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setError('Please enter a valid code (at least 6 digits)');
      toast.error('Please enter a valid code (at least 6 digits)');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await verifyOTP(email, otp);
      handleAuthSuccess();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid verification code. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = () => {
    // Check if there's saved freestyle input
    const savedInput = getFreestyleInput();
    const redirect = getAuthRedirect();

    // Show welcome toast
    toast.success('Welcome to TaTTTy!', {
      description: savedInput ? 'Your input has been restored. Ready to create!' : 'Start creating your unique tattoo designs'
    });

    if (savedInput) {
      // Clear the redirect marker
      clearAuthRedirect();
      // Navigate to generator with the saved input
      // The generator page will check for saved input and restore it
      onNavigate('generate');
    } else if (redirect) {
      clearAuthRedirect();
      onNavigate(redirect);
    } else {
      // Default to home
      onNavigate('home');
    }
  };

  return (
    <div className="min-h-screen flex relative" style={{ backgroundColor: '#0C0C0D' }}>
      {/* Back Button - Fixed Position */}
      <button
        onClick={() => onNavigate('home')}
        className="fixed top-8 left-8 z-50 flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
        style={{
          backgroundColor: 'rgba(87, 241, 214, 0.1)',
          border: '1px solid rgba(87, 241, 214, 0.3)',
        }}
      >
        <ArrowLeft size={20} style={{ color: '#57f1d6' }} />
        <span style={{ color: '#57f1d6' }}>Back</span>
      </button>

      {/* Left Side - Marketing */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1635068247786-5de1ce4c0ff8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YXR0b28lMjBhcnRpc3QlMjBkYXJrJTIwc3R1ZGlvfGVufDF8fHx8MTc2MDU1ODMyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="TaTTTy Studio"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C0C0D]/80 to-transparent"></div>
        
        {/* Marketing Text Overlay */}
        <div className="absolute inset-0 flex flex-col justify-center px-16 max-w-xl">
          <h1 className="text-5xl mb-6 font-[Rock_Salt]" style={{ 
            color: '#57f1d6',
            textShadow: '0px 4px 8px rgba(0, 0, 0, 0.9), 0px 8px 16px rgba(0, 0, 0, 0.7)'
          }}>
            Your story,
            <br />
            your ink
          </h1>
          <p className="text-2xl text-white/90 mb-8 font-[Roboto_Condensed]">
            Join thousands creating unique tattoos powered by AI
          </p>
          <div className="space-y-4 text-white/80">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#57f1d6' }}></div>
              <span className="text-lg">Generate unlimited designs</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#57f1d6' }}></div>
              <span className="text-lg">Connect with top artists</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#57f1d6' }}></div>
              <span className="text-lg">Share your ink journey</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 sm:px-12 lg:px-16">
        <div className="w-full max-w-md">
          {/* Logo/Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-3 font-[Rock_Salt]" style={{ color: '#57f1d6' }}>
              TaTTTy
            </h2>
            <p className="text-white/70 text-lg font-[Roboto_Condensed]">
              {otpSent ? 'Check your inbox' : 'Sign in or create account'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Google Sign In */}
          {!otpSent && (
            <>
              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full h-12 mb-6 bg-white hover:bg-gray-100 text-black border-0"
                style={{ fontWeight: 500 }}
              >
                <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 text-white/50 bg-[#0C0C0D]">or</span>
                </div>
              </div>
            </>
          )}

          {/* Email OTP Form */}
          {!otpSent ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm mb-2 text-white/70">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#57f1d6] focus:ring-[#57f1d6]"
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12"
                style={{
                  backgroundColor: '#57f1d6',
                  color: '#0C0C0D',
                }}
              >
                {isLoading ? 'Sending...' : 'Continue with Email'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm mb-2 text-white/70">
                  Enter verification code
                </label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter code"
                  className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#57f1d6] focus:ring-[#57f1d6] text-center tracking-widest"
                  disabled={isLoading}
                  autoFocus
                  autoComplete="off"
                />
                <p className="text-xs text-white/50 mt-2">
                  Sent to {email}
                </p>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12"
                style={{
                  backgroundColor: '#57f1d6',
                  color: '#0C0C0D',
                }}
              >
                {isLoading ? 'Verifying...' : 'Verify & Continue'}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setOtp('');
                  setError('');
                }}
                variant="ghost"
                className="w-full text-white/50 hover:text-white/70"
                disabled={isLoading}
              >
                Use different email
              </Button>
            </form>
          )}

          {/* Terms */}
          <p className="mt-8 text-xs text-center text-white/40">
            By continuing, you agree to TaTTTy's Terms of Service
            and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
