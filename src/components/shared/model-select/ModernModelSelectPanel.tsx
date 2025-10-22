import React, { useState } from 'react';
import { cn } from '../../../lib/utils';
import { MODEL_OPTION_CONFIGS } from './config';
import { useInk } from '../../../contexts/InkContext';
import { useAuth } from '../../../contexts/AuthContext';
import { MODEL_CONFIGS, type SubscriptionTier } from '../../../types/economy';
import { AuthModal } from '../AuthModal';
import { UpgradeNudge } from '../UpgradeNudge';
import { LowBalanceModal } from '../LowBalanceModal';
import { Zap, Sparkles, Crown, Gauge, Skull } from 'lucide-react';
import { AspectRatio } from '../../ui/aspect-ratio';
import { isModelAvailable, type ModelType } from '../../../types/economy';
import type { ModelOptionId } from './types';

const MODEL_ICONS = {
  auto: Zap,
  flash: Zap,
  medium: Sparkles,
  large: Crown,
  turbo: Gauge,
} as const;

interface ModelCardProps {
  id: ModelOptionId;
  label: string;
  subtitle?: string;
  badge?: string;
  selected: boolean;
  onSelect: (id: ModelOptionId) => void;
  tier: SubscriptionTier | null;
  isAuthenticated: boolean;
  onAuthRequired?: () => void;
  onUpgradeRequired?: (targetTier: 'creator' | 'studio') => void;
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
  onUpgradeRequired,
  authLoading,
  layout = 'standard',
}: ModelCardProps) {
  const Icon = MODEL_ICONS[id as keyof typeof MODEL_ICONS];
  
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
        onUpgradeRequired?.(targetTier);
        return;
      }
    }
    
    // Proceed with selection
    onSelect(id);
  };

  const hasTierAccess = tier ? isModelAvailable(id as ModelType, tier) : true;
  const isAvailable = id === 'auto' || id === 'flash' || hasTierAccess;
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
    fontWeight: id === 'auto' ? 700 : 500,
    fontSize: layout === 'wide' ? '24px' : '20px', // Increased font size as specified
  } as React.CSSProperties;

  const content = (
    <div className="relative w-full h-full">
      <button
        onClick={handleClick}
        className={cn(
          'relative w-full h-full p-4 border-2 transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer',
          isLocked && "opacity-50"
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
            {subtitle && <span>{subtitle}</span>}
            {inkCost !== undefined && (
              <>
                {subtitle && <span>-</span>}
                <span className="flex items-center gap-1">
                  {inkCost} credits
                  {id === 'turbo' && <Skull className="w-3 h-3 text-white/75" />}
                </span>
              </>
            )}
           </div>
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
  selectedModel: ModelOptionId;
  onSelect: (model: ModelOptionId) => void;
}

export function ModernModelSelectPanel({ selectedModel, onSelect }: ModernModelSelectPanelProps) {
  const { tier } = useInk();
  const { isAuthenticated, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeTargetTier, setUpgradeTargetTier] = useState<'creator' | 'studio'>('creator');
  const [showLowBalanceModal, setShowLowBalanceModal] = useState(false);

  const handleAuthRequired = () => {
    setShowAuthModal(true);
  };

  const handleUpgradeRequired = (targetTier: 'creator' | 'studio') => {
    setUpgradeTargetTier(targetTier);
    setShowUpgradeModal(true);
  };

  const handleUpgrade = () => {
    setShowUpgradeModal(false);
    setShowLowBalanceModal(true);
  };

  const handlePurchase = (packId: string) => {
    console.log('Purchase pack:', packId);
    // Navigate to pricing page for actual purchase
  };

  const handleSubscribe = (tier: string) => {
    console.log('Subscribe to:', tier);
    // Navigate to pricing page for subscription
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
            onUpgradeRequired={handleUpgradeRequired}
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
            onUpgradeRequired={handleUpgradeRequired}
            authLoading={isLoading}
            layout="wide"
          />
        </div>
      )}

      {/* Auth Modal - For unsigned users */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      {/* Upgrade Modal - For signed-in users */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#2A2A2A] border border-white/10 rounded-xl p-6 max-w-md w-full">
            <UpgradeNudge
              targetTier={upgradeTargetTier}
              feature={`${upgradeTargetTier === 'studio' ? 'Turbo' : 'Premium'} models`}
              variant="card"
              onUpgrade={handleUpgrade}
            />
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="mt-4 w-full py-2 text-white/60 hover:text-white/80 transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}

      {/* Low Balance Modal - For subscription flow */}
      {showLowBalanceModal && (
        <LowBalanceModal
          isOpen={showLowBalanceModal}
          onClose={() => setShowLowBalanceModal(false)}
          requiredInk={0}
          onPurchase={handlePurchase}
          onSubscribe={handleSubscribe}
        />
      )}
    </div>
  );
}
