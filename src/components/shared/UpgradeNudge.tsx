import { ArrowRight, Lock, Sparkles } from 'lucide-react';
import { SubscriptionTier, TIER_PRICING, TIER_FEATURES } from '../../types/economy';
import { cn } from '../ui/utils';

interface UpgradeNudgeProps {
  targetTier: 'creator' | 'studio';
  feature: string;
  variant?: 'inline' | 'banner' | 'card';
  onUpgrade?: () => void;
  className?: string;
}

export function UpgradeNudge({
  targetTier,
  feature,
  variant = 'inline',
  onUpgrade,
  className,
}: UpgradeNudgeProps) {
  const tierFeatures = TIER_FEATURES[targetTier];
  const pricing = TIER_PRICING[targetTier];
  
  if (variant === 'inline') {
    return (
      <div
        className={cn(
          'flex items-center justify-between gap-3 px-4 py-3 rounded-lg',
          'bg-[#57f1d6]/5 border border-[#57f1d6]/20',
          'backdrop-blur-sm',
          className
        )}
      >
        <div className="flex items-center gap-3">
          <Lock className="w-4 h-4 text-[#57f1d6]" />
          <div>
            <p className="text-sm text-white/90">
              Unlock {feature} with {targetTier === 'creator' ? 'Creator' : 'Studio'}
            </p>
            <p className="text-xs text-white/60 mt-0.5">
              ${pricing.monthly}/mo — includes {tierFeatures.monthlyInk} INK/month
            </p>
          </div>
        </div>
        
        {onUpgrade && (
          <button
            onClick={onUpgrade}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#57f1d6] text-[#0C0C0D] rounded-md text-sm font-medium hover:bg-[#57f1d6]/90 transition-all"
          >
            Upgrade
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }
  
  if (variant === 'banner') {
    return (
      <div
        className={cn(
          'w-full px-4 py-3 rounded-lg',
          'bg-gradient-to-r from-[#57f1d6]/10 to-transparent',
          'border-l-2 border-[#57f1d6]',
          className
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#57f1d6]" />
            <div>
              <p className="text-white/90">
                Unlock {feature} with {targetTier === 'creator' ? 'Creator' : 'Studio'}
              </p>
              <p className="text-xs text-white/60 mt-1">
                ${pricing.monthly}/mo • {tierFeatures.monthlyInk} INK/month • 
                {tierFeatures.models.length} models • {tierFeatures.queuePriority} queue
              </p>
            </div>
          </div>
          
          {onUpgrade && (
            <button
              onClick={onUpgrade}
              className="flex items-center gap-2 px-4 py-2 bg-[#57f1d6] text-[#0C0C0D] rounded-lg font-medium hover:bg-[#57f1d6]/90 transition-all"
            >
              Upgrade Now
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }
  
  // Card variant
  return (
    <div
      className={cn(
        'p-6 rounded-lg',
        'bg-[#57f1d6]/5 border border-[#57f1d6]/20',
        'backdrop-blur-sm',
        className
      )}
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#57f1d6]/10">
            <Lock className="w-5 h-5 text-[#57f1d6]" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-medium">
              {feature} is a {targetTier === 'creator' ? 'Creator' : 'Studio'} feature
            </h3>
            <p className="text-sm text-white/60 mt-1">
              Upgrade to unlock this feature plus more benefits
            </p>
          </div>
        </div>
        
        <div className="space-y-2 text-sm text-white/80">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-[#57f1d6]" />
            <span>{tierFeatures.monthlyInk} INK per month</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-[#57f1d6]" />
            <span>Access to {tierFeatures.models.join(', ')} models</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-[#57f1d6]" />
            <span>{tierFeatures.queuePriority} queue priority</span>
          </div>
          {tierFeatures.includedUpscales > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-[#57f1d6]" />
              <span>{tierFeatures.includedUpscales} free upscales per month</span>
            </div>
          )}
        </div>
        
        {onUpgrade && (
          <button
            onClick={onUpgrade}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#57f1d6] text-[#0C0C0D] rounded-lg font-medium hover:bg-[#57f1d6]/90 transition-all"
          >
            Upgrade to {targetTier === 'creator' ? 'Creator' : 'Studio'} — ${pricing.monthly}/mo
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
