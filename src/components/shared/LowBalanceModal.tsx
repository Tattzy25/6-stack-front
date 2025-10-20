import { Droplet, Zap, Package, CreditCard, X } from 'lucide-react';
import { useInk } from '../../contexts/InkContext';
import {
  TOKEN_PACKS,
  SESSION_BOOSTER,
  TIER_PRICING,
  TIER_FEATURES,
  type SubscriptionTier,
} from '../../types/economy';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { cn } from '../ui/utils';

interface LowBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredInk?: number;
  onPurchase?: (packId: string) => void;
  onSubscribe?: (tier: SubscriptionTier) => void;
}

export function LowBalanceModal({
  isOpen,
  onClose,
  requiredInk,
  onPurchase,
  onSubscribe,
}: LowBalanceModalProps) {
  const { balance, tier } = useInk();
  
  const shortfall = requiredInk ? Math.max(0, requiredInk - balance) : 0;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0C0C0D]/98 backdrop-blur-xl border border-[#57f1d6]/20 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white flex items-center gap-3">
            <Droplet className="w-6 h-6 text-[#57f1d6]" fill="#57f1d6" />
            Need more INK?
          </DialogTitle>
          <DialogDescription className="text-white/60">
            {shortfall > 0 ? (
              <>You need {shortfall} more INK to continue. Choose an option below:</>
            ) : (
              <>Choose how you'd like to get more INK:</>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Session Booster - Quick Buy */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#57f1d6]" />
              <h3 className="text-sm text-white/80">Quick Boost</h3>
            </div>
            
            <button
              onClick={() => onPurchase?.(SESSION_BOOSTER.id)}
              className="w-full p-4 rounded-lg bg-[#57f1d6] text-[#0C0C0D] hover:bg-[#57f1d6]/90 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="font-medium text-lg">{SESSION_BOOSTER.name}</p>
                  <p className="text-sm opacity-80">{SESSION_BOOSTER.ink} INK for just ${SESSION_BOOSTER.priceUsd}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-2xl">${SESSION_BOOSTER.priceUsd}</p>
                  <p className="text-xs opacity-70">Instant delivery</p>
                </div>
              </div>
            </button>
          </div>
          
          {/* Subscribe for Better Value */}
          {tier === 'free' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#57f1d6]" />
                <h3 className="text-sm text-white/80">Subscribe for cheaper INK</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <SubscriptionCard
                  tier="creator"
                  onSelect={() => onSubscribe?.('creator')}
                />
                <SubscriptionCard
                  tier="studio"
                  onSelect={() => onSubscribe?.('studio')}
                  featured
                />
              </div>
            </div>
          )}
          
          {/* Token Packs */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-[#57f1d6]" />
              <h3 className="text-sm text-white/80">One-time Packs</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {TOKEN_PACKS.map((pack) => (
                <PackCard
                  key={pack.id}
                  pack={pack}
                  onSelect={() => onPurchase?.(pack.id)}
                  recommended={shortfall > 0 && pack.ink >= shortfall && pack.id === 'small'}
                />
              ))}
            </div>
            
            <p className="text-xs text-white/40 text-center">
              Packs expire in 6 months. Subscribe within 24h and get 50% of pack spend credited to your first month.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// SUBSCRIPTION CARD
// ============================================================================

interface SubscriptionCardProps {
  tier: 'creator' | 'studio';
  onSelect: () => void;
  featured?: boolean;
}

function SubscriptionCard({ tier, onSelect, featured }: SubscriptionCardProps) {
  const features = TIER_FEATURES[tier];
  const pricing = TIER_PRICING[tier];
  
  const perInkCost = (pricing.monthly / features.monthlyInk).toFixed(3);
  
  return (
    <button
      onClick={onSelect}
      className={cn(
        'p-4 rounded-lg border backdrop-blur-sm text-left transition-all duration-200',
        featured
          ? 'bg-[#57f1d6]/10 border-[#57f1d6] ring-2 ring-[#57f1d6]/50'
          : 'bg-white/5 border-white/20 hover:border-[#57f1d6]/30'
      )}
    >
      <div className="space-y-3">
        {featured && (
          <span className="inline-block px-2 py-0.5 bg-[#57f1d6] text-[#0C0C0D] text-xs rounded-full">
            Best Value
          </span>
        )}
        
        <div>
          <h4 className="text-white font-medium capitalize">{tier}</h4>
          <p className="text-2xl font-mono text-[#57f1d6] mt-1">
            ${pricing.monthly}
            <span className="text-sm text-white/60">/mo</span>
          </p>
        </div>
        
        <div className="space-y-1 text-xs text-white/60">
          <p>✓ {features.monthlyInk} INK/month</p>
          <p>✓ {features.models.length} models unlocked</p>
          <p>✓ ${perInkCost} per INK</p>
        </div>
      </div>
    </button>
  );
}

// ============================================================================
// PACK CARD
// ============================================================================

interface PackCardProps {
  pack: typeof TOKEN_PACKS[0];
  onSelect: () => void;
  recommended?: boolean;
}

function PackCard({ pack, onSelect, recommended }: PackCardProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'p-3 rounded-lg border backdrop-blur-sm text-left transition-all duration-200',
        recommended
          ? 'bg-[#57f1d6]/10 border-[#57f1d6]/50 ring-1 ring-[#57f1d6]/30'
          : 'bg-white/5 border-white/10 hover:border-white/20'
      )}
    >
      <div className="space-y-2">
        {recommended && (
          <span className="inline-block px-1.5 py-0.5 bg-[#57f1d6]/20 text-[#57f1d6] text-xs rounded">
            Recommended
          </span>
        )}
        
        <div>
          <h4 className="text-white text-sm">{pack.name}</h4>
          <p className="text-lg font-mono text-[#57f1d6] mt-0.5">
            {pack.ink} INK
          </p>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/60">${pack.priceUsd}</span>
          <span className="text-white/40">${pack.perInkCost.toFixed(3)}/INK</span>
        </div>
      </div>
    </button>
  );
}
