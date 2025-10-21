import { toast } from 'sonner';

interface AuthPromptToastProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

export function showAuthPromptToast({ onSignIn, onSignUp }: AuthPromptToastProps) {
  toast.custom(
    (t) => (
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 z-[9998]"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          }}
          onClick={() => toast.dismiss(t)}
        />
        
        {/* Modal */}
        <div 
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999]"
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1))',
            borderRadius: '24px',
            border: '2px solid rgba(87, 241, 214, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            padding: '32px',
            minWidth: '400px',
            maxWidth: '90vw',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <h3 className="text-accent">Your story's safe with us!</h3>
              <p className="text-white/80">
                Don't worry, we've saved your text. Sign in or sign up to bring your ink to life.
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  toast.dismiss(t);
                  onSignIn();
                }}
                className="px-6 py-3 rounded-full transition-all hover:scale-105"
                style={{
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
                  border: '1px solid rgba(87, 241, 214, 0.4)',
                  color: '#57f1d6',
                }}
              >
                Sign In
              </button>

              <button
                onClick={() => {
                  toast.dismiss(t);
                  onSignUp();
                }}
                className="px-6 py-3 rounded-full transition-all hover:scale-105"
                style={{
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  background: 'linear-gradient(135deg, rgba(87, 241, 214, 0.3), rgba(87, 241, 214, 0.2))',
                  border: '1px solid rgba(87, 241, 214, 0.6)',
                  color: '#ffffff',
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </>
    ),
    {
      duration: Infinity,
      position: 'top-center',
    }
  );
}
