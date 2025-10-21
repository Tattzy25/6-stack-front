import { useState, useRef, useEffect } from 'react';
import { Sparkles, Droplet, MessageCircle, ShoppingCart } from 'lucide-react';
import { useInk } from '../../contexts/InkContext';
import { useAuth } from '../../contexts/AuthContext';
import { useModal } from '../../contexts/ModalContext';
import { InkCostButton } from './InkCostButton';

interface AskTaTTTyProps {
  // Core functionality
  onOptimize?: () => void | Promise<void>;
  onIdeas?: () => void | Promise<void>;
  
  // Legacy support - for inserting text directly
  onAssist?: (enhancedText: string) => void;
  
  // Navigation for InK uP flow
  onNavigate?: (page: string) => void;
  
  // Context for default suggestions (when no custom handlers provided)
  contextType?: 'couples' | 'coverup' | 'extend' | 'tattty' | 'freestyle' | 'weird' | 'general';
  
  // Current state for API calls
  currentText?: string;
  hasText?: boolean;
  hasImages?: boolean;
  imageCount?: number;
  
  // UI customization
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  
  // Error display
  error?: string | null;
  isLoading?: boolean;
  
  // API integration (future)
  apiEndpoint?: string;
  apiKey?: string;
}

export function AskTaTTTy({ 
  onOptimize,
  onIdeas,
  onAssist,
  onNavigate,
  contextType = 'general',
  currentText = '',
  hasText = false,
  hasImages = false,
  imageCount = 0,
  size = 'md',
  className = '',
  error: externalError,
  isLoading: externalLoading = false,
  apiEndpoint,
  apiKey,
}: AskTaTTTyProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [actionPending, setActionPending] = useState<'optimize' | 'idea' | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { 
    tier, 
    balance, 
    getAskTaTTTyActionCost, 
    canAfford, 
    deductInk,
    usageToday 
  } = useInk();
  const { openAuthModal, openLowBalanceModal } = useModal();
  
  const showLoading = externalLoading || isLoading;
  
  // Get costs for each action
  const optimizeCost = getAskTaTTTyActionCost('optimize');
  const ideaCost = getAskTaTTTyActionCost('idea');
  const brainstormCost = getAskTaTTTyActionCost('brainstorm'); // per 10 messages

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Default suggestion generator (fallback when no custom handlers provided)
  const getDefaultSuggestion = (type: 'optimize' | 'ideas'): string => {
    if (type === 'optimize') {
      switch (contextType) {
        case 'couples':
          return 'We met at a coffee shop in Portland during a rainstorm. I want matching raindrop designs on our wrists, with our anniversary date hidden in the pattern. Simple black ink, small enough to be subtle but meaningful to us.';
        case 'coverup':
          return 'I have an old tribal band from 2005 that needs covering. Turn it into a realistic black and grey forest scene wrapping around my arm, with pine trees growing through where the old design was. Make it dark enough to fully hide the tribal.';
        case 'extend':
          return 'Looking at your current tattoo, I can extend it seamlessly by incorporating complementary elements that flow naturally from the existing design. The style and theme can expand upward/outward with organic transitions, creating a cohesive larger piece.';
        case 'freestyle':
          return 'I want a full back piece featuring a Japanese-style koi fish swimming up my spine, surrounded by cherry blossoms and water. Traditional Japanese colors - orange koi, pink blossoms, blue water waves. Bold outlines, classic irezumi style.';
        default:
          return 'Design optimized with placement, size, and style details added for best results.';
      }
    } else {
      switch (contextType) {
        case 'couples':
          return 'Ideas: 1) Matching puzzle pieces that fit together 2) Split coordinates of where you met 3) Complementary sun and moon designs 4) Matching soundwaves of "I love you" in each other\'s voices.';
        case 'coverup':
          return 'Ideas: 1) Bold geometric mandala 2) Dark floral sleeve with peonies 3) Realistic animal portrait (wolf, lion, or eagle) 4) Japanese wave patterns with koi fish 5) Biomechanical design.';
        case 'extend':
          return 'Ideas: 1) Extend with complementary nature elements 2) Add celestial patterns (stars, moons, constellations) 3) Geometric sacred geometry expansion 4) Watercolor splash effects bleeding outward 5) Ornamental filigree borders.';
        case 'freestyle':
          return 'Ideas: 1) Hyper-realistic portrait sleeve 2) Abstract watercolor chaos 3) Traditional Japanese full back 4) Blackwork geometric patterns 5) Neo-traditional nature scene 6) Surreal dreamscape chest piece.';
        default:
          return 'Here are some fresh ideas to explore based on current trends and your context.';
      }
    }
  };

  // API call for real-time AI suggestions
  const callAIAssist = async (type: 'optimize' | 'ideas'): Promise<string> => {
    if (!apiEndpoint) {
      throw new Error('API endpoint not configured');
    }

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { 'Authorization': `Bearer ${apiKey}` }),
      },
      body: JSON.stringify({
        type,
        contextType,
        currentText,
        hasText,
        hasImages,
        imageCount,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI assist failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.suggestion || data.text || '';
  };

  const ensureAuthenticated = (): boolean => {
    if (isAuthLoading) {
      return false;
    }

    if (!isAuthenticated) {
      setIsOpen(false);
      openAuthModal();
      return false;
    }

    return true;
  };

  const handleOptimize = async () => {
    if (!ensureAuthenticated()) {
      return;
    }

    // Check if user can afford this action
    const cost = optimizeCost === 'free' ? 0 : optimizeCost;
    
    if (!canAfford(cost)) {
      setActionPending('optimize');
      setIsOpen(false);
      openLowBalanceModal({
        requiredCredits: cost,
        onPurchase: handlePurchase,
        onSubscribe: handleSubscribe,
        onClose: () => setActionPending(null),
      });
      return;
    }
    
    // Deduct INK if not free
    if (cost > 0) {
      const result = await deductInk({
        amount: cost,
        type: 'ask-tattty',
        metadata: { actionType: 'optimize' },
      });
      
      if (!result.success) {
        console.error('Failed to deduct INK for optimize');
        return;
      }
    }
    
    // If custom handler provided, use it
    if (onOptimize) {
      setIsLoading(true);
      setIsOpen(false); // Close after starting
      // Add 2 second delay for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));
      await onOptimize();
      setIsLoading(false);
      return;
    }

    // Otherwise, try API or fall back to defaults
    setIsLoading(true);
    try {
      // Add 2 second minimum delay for better UX
      const [suggestion] = await Promise.all([
        apiEndpoint ? callAIAssist('optimize') : Promise.resolve(getDefaultSuggestion('optimize')),
        new Promise(resolve => setTimeout(resolve, 2000))
      ]);
      
      if (onAssist) {
        onAssist(suggestion);
      }
    } catch (error) {
      console.error('Optimize failed:', error);
      // Fallback to default if API fails
      if (onAssist) {
        onAssist(getDefaultSuggestion('optimize'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleIdeas = async () => {
    if (!ensureAuthenticated()) {
      return;
    }

    // Check if user can afford this action
    const cost = ideaCost === 'free' ? 0 : ideaCost;
    
    if (!canAfford(cost)) {
      setActionPending('idea');
      setIsOpen(false);
      openLowBalanceModal({
        requiredCredits: cost,
        onPurchase: handlePurchase,
        onSubscribe: handleSubscribe,
        onClose: () => setActionPending(null),
      });
      return;
    }
    
    // Deduct INK if not free
    if (cost > 0) {
      const result = await deductInk({
        amount: cost,
        type: 'ask-tattty',
        metadata: { actionType: 'idea' },
      });
      
      if (!result.success) {
        console.error('Failed to deduct INK for idea');
        return;
      }
    }
    
    // If custom handler provided, use it
    if (onIdeas) {
      setIsLoading(true);
      setIsOpen(false); // Close after starting
      // Add 2 second delay for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));
      await onIdeas();
      setIsLoading(false);
      return;
    }

    // Otherwise, try API or fall back to defaults
    setIsLoading(true);
    try {
      // Add 2 second minimum delay for better UX
      const [suggestion] = await Promise.all([
        apiEndpoint ? callAIAssist('ideas') : Promise.resolve(getDefaultSuggestion('ideas')),
        new Promise(resolve => setTimeout(resolve, 2000))
      ]);
      
      if (onAssist) {
        onAssist(suggestion);
      }
    } catch (error) {
      console.error('Ideas generation failed:', error);
      // Fallback to default if API fails
      if (onAssist) {
        onAssist(getDefaultSuggestion('ideas'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInkUp = () => {
    setIsOpen(false);

    // If not authenticated and not loading, show auth modal first
    if (!ensureAuthenticated()) {
      return;
    }

    openLowBalanceModal({
      onPurchase: handlePurchase,
      onSubscribe: handleSubscribe,
    });
  };
  
  const handlePurchase = (packId: string) => {
    console.log('Purchase pack:', packId);
    // Navigate to pricing page for actual purchase
    if (onNavigate) {
      onNavigate('pricing');
    }
  };
  
  const handleSubscribe = (tier: string) => {
    console.log('Subscribe to:', tier);
    // Navigate to pricing page for subscription
    if (onNavigate) {
      onNavigate('pricing');
    }
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <div className={`relative inline-block ${className}`} ref={tooltipRef}>
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={showLoading}
        className={`${sizeClasses[size]} ${externalError ? 'bg-gradient-to-r from-red-500/80 to-red-600 border-2 border-red-400' : 'bg-gradient-to-r from-accent/80 to-accent'} text-background font-[Orbitron] transition-all duration-300 flex items-center gap-2 hover:shadow-[0_0_20px_rgba(87,241,214,0.6)] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
        style={{
          boxShadow: externalError ? '0 0 15px rgba(239, 68, 68, 0.5)' : '0 0 15px rgba(87, 241, 214, 0.4)',
          letterSpacing: '2px',
          borderRadius: '12px',
        }}
      >
        <Sparkles 
          size={iconSizes[size]} 
          className={showLoading ? "animate-spin" : "animate-pulse"} 
        />
        <span className="text-[24px] font-bold">
          {externalError ? 'Error!' : showLoading ? 'Thinking...' : 'Ask TaTTTy'}
        </span>
      </button>

      {/* Error Message Below Button */}
      {externalError && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-red-950/90 border-2 border-red-500/50 rounded-xl p-3 shadow-xl z-50">
          <p className="text-red-200 text-sm font-[Roboto_Condensed] text-center">
            {externalError}
          </p>
        </div>
      )}

      {/* Dropdown Tooltip */}
      {isOpen && !externalError && (
        <div
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-[#0C0C0D]/95 backdrop-blur-xl border-2 border-[#57f1d6]/30 rounded-2xl p-3 shadow-xl z-50"
          style={{
            boxShadow: '0 0 20px rgba(87, 241, 214, 0.3)',
          }}
        >
          {onOptimize && (
            <InkCostButton
              onClick={handleOptimize}
              disabled={showLoading}
              label={onIdeas ? 'Optimize My Text' : 'Brainstorm'}
              inkCost={optimizeCost}
              variant="secondary"
              className="w-full mb-2"
            />
          )}
          {onIdeas && (
            <InkCostButton
              onClick={handleIdeas}
              disabled={showLoading}
              label="Give Me Ideas"
              inkCost={ideaCost}
              variant="secondary"
              className="w-full"
            />
          )}
          
          {/* InK uP Button - For buying more INK */}
          <button
            onClick={handleInkUp}
            className="w-full mt-3 py-2.5 px-4 bg-[#57f1d6] text-[#0C0C0D] rounded-lg font-medium transition-all duration-200 hover:bg-[#57f1d6]/90 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>InK uP</span>
          </button>
        </div>
      )}
      
    </div>
  );
}
