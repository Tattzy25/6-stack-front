import React from 'react';
import { cn } from '../../../lib/utils';
import { MODEL_OPTION_CONFIGS } from './config';
import { useInk } from '../../../contexts/InkContext';
import { useAuth } from '../../../contexts/AuthContext';
import { MODEL_CONFIGS } from '../../../types/economy';
import { Zap, Sparkles, Crown, Gauge, Skull } from 'lucide-react';
import { AspectRatio } from '../../ui/aspect-ratio';
import { isModelAvailable, type ModelType } from '../../../types/economy';
import { useModal } from '../../../contexts/ModalContext';

const MODEL_ICONS = {
  auto: Zap,
  flash: Zap,
  medium: Sparkles,
  large: Crown,
  turbo: Gauge,
} as const;

interface ModelCardProps {
  id: string;
  label: string;
  subtitle: string;
  badge?: string;
  selected: boolean;
  onSelect: (id: string) => void;
  tier: string | null;
  isAuthenticated: boolean;
  onAuthRequired?: () => void;
  onUnlockRequired?: (
    targetTier: 'creator' | 'studio',
    meta: { id: string; label: string }
  ) => void;
  authLoading: boolean;
  layout?: 'standard' | 'wide';
}

function ModelCard({
  id,
  label,
  subtitle,
  badge,
  selected,
  onSelect,
  tier,
  isAuthenticated,
  onAuthRequired,
  onUnlockRequired,
  authLoading,
  layout = 'standard',
}: ModelCardProps) {
  const Icon = MODEL_ICONS[id];
  
  // Calculate ink cost from MODEL_CONFIGS
  const getInkCost = () => {
    if (id === 'auto') {
      // For auto, use the default model for the tier
      const defaultModel = tier === 'studio' ? 'large' : tier === 'creator' ? 'medium' : 'flash';
      return MODEL_CONFIGS[defaultModel].baseInkCost;
    }
    return MODEL_CONFIGS[id as ModelType]?.baseInkCost || 8;
  };
  
  const inkCost = getInkCost();
  
  const handleClick = () => {
    // Don't trigger auth modal if authentication is still loading
    if (authLoading) {
      return;
    }
    
    if (!isAuthenticated) {
      // If user is not authenticated, show auth modal
      onAuthRequired?.();
      return;
    }
    
    // If authenticated, check tier restrictions for paid models
    if (id !== 'auto' && id !== 'flash') {
      const model = id as ModelType;
      if (tier && !isModelAvailable(model, tier as any)) {
        // For authenticated users with insufficient tier, show upgrade modal
        const targetTier = model === 'turbo' ? 'studio' : 'creator';
        onUnlockRequired?.(targetTier, { id, label });
        return;
      }
    }
    
    // Proceed with selection
    onSelect(id);
  };

  const isAvailable = !tier || id === 'auto' || id === 'flash' || isModelAvailable(id as ModelType, tier);
  const isLocked = !isAuthenticated || !isAvailable;

  // Visual styling matching the original design
  const selectedStyle = {
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    background: 'linear-gradient(90deg, hsla(169, 85%, 64%, 0.18), hsla(169, 85%, 64%, 0.06))',
    borderRadius: '24px',
    borderColor: 'rgba(87, 241, 214, 0.45)',
    boxShadow: '0 0 40px rgba(0, 0, 0, 0.9), 0 0 30px rgba(87, 241, 214, 0.25)',
  } as React.CSSProperties;

  const baseStyle = {
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    background: 'linear-gradient(90deg, hsla(0, 0%, 100%, 0.12), hsla(0, 0%, 100%, 0.04))',
    borderRadius: '24px',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    boxShadow: '0 0 40px rgba(0, 0, 0, 0.9)',
  } as React.CSSProperties;

  const textStyle = {
    fontFamily: 'Orbitron, sans-serif',
    textShadow: '0 1px 2px #000, 0 2px 8px rgba(0,0,0,0.55)',
    fontWeight: id === 'auto' ? 600 : 400,
  } as React.CSSProperties;

  const labelTextStyle = {
    fontFamily: 'Orbitron, sans-serif',
    textShadow: '0 1px 2px #000, 0 2px 8px rgba(0,0,0,0.55)',
    fontWeight: id === 'auto' ? 600 : 400,
    fontSize: layout === 'wide' ? '20px' : '18px', // Increased font size as specified
  } as React.CSSProperties;

  const content = (
    <div className="relative w-full h-full">
      <button
        onClick={handleClick}
        className={cn(
          'relative w-full h-full p-4 border-2 transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer',
          isLocked && "opacity-80 hover:opacity-100"
        )}
        style={selected ? selectedStyle : baseStyle}
        aria-disabled={isLocked}
      >
        {/* Badge positioned at right edge of the card */}
        {badge && (
          <span className="absolute -top-2 right-3 px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-[#57f1d6] to-[#00d4ff] text-black border border-[#57f1d6]/40 shadow-[0_0_30px_rgba(87,241,214,0.3)] z-10">
            {badge}
          </span>
        )}

        {/* Centered content */}
         <div className="flex flex-col items-center justify-center w-full h-full text-center gap-1">
           <div className="flex items-center justify-center gap-2">
             <Icon className="w-5 h-5 text-[#57f1d6]" />
             <p className={cn('font-medium', selected ? 'text-[#57f1d6]' : 'text-white')} style={labelTextStyle}>
               {label}
             </p>
           </div>
           <div className="flex items-center gap-1 text-sm text-white/75" style={textStyle}>
             <span>{subtitle}</span>
             {inkCost !== undefined && (
               <>
                 <span>—</span>
                 <span className="flex items-center gap-1">
                   {inkCost} credits
                   {id === 'turbo' && <Skull className="w-3 h-3 text-white/75" />}
                 </span>
               </>
             )}
           </div>
           {isLocked && (
             <span className="text-[11px] uppercase tracking-[0.2em] text-[#57f1d6]/80">
               Tap to unlock options
             </span>
           )}
         </div>
      </button>
    </div>
  );

  if (layout === 'wide') {
    return <div className="w-full h-24 sm:h-28 relative">{content}</div>;
  }
  
  return <AspectRatio ratio={1} className="relative">{content}</AspectRatio>;
}

interface ModernModelSelectPanelProps {
  selectedModel: string;
  onSelect: (model: string) => void;
}

export function ModernModelSelectPanel({ selectedModel, onSelect }: ModernModelSelectPanelProps) {
  const { tier } = useInk();
  const { isAuthenticated, isLoading } = useAuth();
  const { openAuthModal, openUnlockModelModal, openLowBalanceModal } = useModal();

  const handleAuthRequired = () => {
    openAuthModal();
  };

  const handleBoost = (modelId: string, modelLabel: string) => {
    handlePurchase('session-booster');
    onSelect(modelId);
    console.info(`Boosted access granted for ${modelLabel}`);
  };

  const handlePurchase = (packId: string) => {
    console.log('Purchase pack:', packId);
    // Navigate to pricing page for actual purchase
  };

  const handleSubscribe = (tier: string) => {
    console.log('Subscribe to:', tier);
    // Navigate to pricing page for subscription
  };

  const handleUnlockRequired = (targetTier: 'creator' | 'studio', meta: { id: string; label: string }) => {
    openUnlockModelModal({
      modelId: meta.id,
      modelLabel: meta.label,
      targetTier,
      onBoost: () => handleBoost(meta.id, meta.label),
      onSubscribe: (tierChoice) => {
        handleSubscribe(tierChoice);
        openLowBalanceModal({
          requiredCredits: targetTier === 'studio' ? 1200 : 400,
          title: `Upgrade to ${targetTier === 'studio' ? 'Studio' : 'Creator'}`,
          description: 'Choose a plan that keeps premium models unlocked every day.',
        });
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Standard Models Grid - 4 cards per row on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {MODEL_OPTION_CONFIGS.filter(config => config.id !== 'turbo').map((config) => (
          <ModelCard
            key={config.id}
            id={config.id}
            label={config.label}
            subtitle={config.subtitle}
            badge={config.badge}
            selected={selectedModel === config.id}
            onSelect={onSelect}
            tier={tier}
            isAuthenticated={isAuthenticated}
            onAuthRequired={handleAuthRequired}
            onUnlockRequired={handleUnlockRequired}
            authLoading={isLoading}
            layout="standard"
          />
        ))}
      </div>

      {/* Turbo Model - Full width row */}
      {MODEL_OPTION_CONFIGS.find(config => config.id === 'turbo') && (
        <div className="w-full">
          <ModelCard
            key="turbo"
            id="turbo"
            label={MODEL_OPTION_CONFIGS.find(config => config.id === 'turbo')!.label}
            subtitle={MODEL_OPTION_CONFIGS.find(config => config.id === 'turbo')!.subtitle}
            badge={MODEL_OPTION_CONFIGS.find(config => config.id === 'turbo')!.badge}
            selected={selectedModel === 'turbo'}
            onSelect={onSelect}
            tier={tier}
            isAuthenticated={isAuthenticated}
            onAuthRequired={handleAuthRequired}
            onUnlockRequired={handleUnlockRequired}
            authLoading={isLoading}
            layout="wide"
          />
        </div>
      )}
    </div>
  );
}
