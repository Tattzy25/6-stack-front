import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Droplet, Zap, Crown, Lock, ArrowRight } from 'lucide-react';
import { 
  TIER_PRICING, 
  TIER_FEATURES, 
  TOKEN_PACKS,
  type SubscriptionTier 
} from '../types/economy';
import { useInk } from '../contexts/InkContext';

interface PricingPageProps {
  onNavigate: (page: string) => void;
}

export function PricingPage({ onNavigate }: PricingPageProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const { tier: currentTier } = useInk();
  
  const tiers: SubscriptionTier[] = ['free', 'creator', 'studio'];
  
  return (
    <div className="min-h-screen bg-[#2a2a2a]">
      {/* Header Section - Curved Bottom Like Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden rounded-b-[100px] border-b-4" style={{ borderColor: '#57f1d6', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8)' }}>
        <div className="container mx-auto px-4">
          <div className="text-center pt-[120px] pb-[80px]">
            <motion.h1 
              className="text-7xl md:text-8xl text-black mb-4"
              style={{ 
                fontFamily: 'Rock Salt, cursive',
                textShadow: '4px 4px 8px rgba(0, 0, 0, 0.8), 2px 2px 4px rgba(0, 0, 0, 0.6)'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-[#57f1d6] underline">InK</span> uP or <span className="text-[#57f1d6] underline not-italic">InK</span> OuT
            </motion.h1>
            <motion.p 
              className="text-xl text-white max-w-2xl mx-auto"
              style={{ 
                fontFamily: 'Roboto Condensed, sans-serif',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), 1px 1px 2px rgba(0, 0, 0, 0.6)'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              (the door--&gt;)
            </motion.p>
          </div>
        </div>
      </section>

      {/* Pricing Content Section */}
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center gap-4 p-1.5 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-[#57f1d6] text-[#0C0C0D] font-medium'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${
                billingCycle === 'annual'
                  ? 'bg-[#57f1d6] text-[#0C0C0D] font-medium'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Annual
              <span className="text-xs bg-[#57f1d6]/20 px-2 py-0.5 rounded-full">
                Save 2 months
              </span>
            </button>
          </div>
        </div>
        
        {/* Subscription Tiers */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {tiers.map((tier, index) => {
            const features = TIER_FEATURES[tier];
            const pricing = TIER_PRICING[tier];
            const price = billingCycle === 'annual' ? pricing.annual : pricing.monthly;
            const monthlyEquivalent = billingCycle === 'annual' ? pricing.annual / 12 : pricing.monthly;
            const isCurrentTier = tier === currentTier;
            const isFeatured = tier === 'creator';
            
            return (
              <TierCard
                key={tier}
                tier={tier}
                features={features}
                price={price}
                monthlyEquivalent={monthlyEquivalent}
                billingCycle={billingCycle}
                isCurrentTier={isCurrentTier}
                isFeatured={isFeatured}
                onSelect={() => {
                  // Handle subscription selection
                  console.log(`Selected ${tier} - ${billingCycle}`);
                  // TODO: Navigate to checkout or subscription flow
                }}
              />
            );
          })}
        </div>
        
        {/* Token Packs Section */}
        <div className="border-t border-white/10 pt-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              One-Time <span className="text-[#57f1d6]">INK</span> Packs
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Need a quick boost? Grab a token pack. Packs expire in 6 months.
              <br />
              <span className="text-[#57f1d6] text-sm">
                Subscribe within 24h and get 50% of pack spend credited to your first month!
              </span>
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {TOKEN_PACKS.map((pack) => (
              <TokenPackCard
                key={pack.id}
                pack={pack}
                onPurchase={() => {
                  console.log(`Purchase pack: ${pack.id}`);
                  // TODO: Navigate to PayPal checkout
                }}
              />
            ))}
          </div>
          
          {/* Session Booster Callout */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="p-6 rounded-xl bg-gradient-to-r from-[#57f1d6]/10 to-transparent border-l-4 border-[#57f1d6]">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-5 h-5 text-[#57f1d6]" />
                <h3 className="text-white font-medium">Session Booster</h3>
              </div>
              <p className="text-white/60 text-sm mb-3">
                Running low mid-session? Get <span className="text-white font-medium">120 INK for $5.99</span> — 
                available when your balance drops below 50 INK.
              </p>
              <p className="text-xs text-white/40">
                Perfect for when inspiration strikes and you need just a bit more fuel.
              </p>
            </div>
          </div>
        </div>
        
        {/* FAQ / Value Props */}
        <div className="mt-20 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <ValueProp
            title="INK Rollover"
            description="Unused INK rolls for 60 days (paid) / 30 days (free). Your INK doesn't vanish — use it when inspiration strikes."
          />
          <ValueProp
            title="Daily Streak Bonus"
            description="+5 INK/day when you log in. Cap at +25 INK per week. Consistency pays off."
          />
          <ValueProp
            title="Transparent Costs"
            description="Every action shows its INK cost before you confirm. No surprises, ever."
          />
          <ValueProp
            title="Flexible Upgrades"
            description="Upgrade anytime with immediate access. Downgrade at next cycle with rollover preserved."
          />
        </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// TIER CARD COMPONENT
// ============================================================================

interface TierCardProps {
  tier: SubscriptionTier;
  features: typeof TIER_FEATURES[SubscriptionTier];
  price: number;
  monthlyEquivalent: number;
  billingCycle: 'monthly' | 'annual';
  isCurrentTier: boolean;
  isFeatured: boolean;
  onSelect: () => void;
}

function TierCard({
  tier,
  features,
  price,
  monthlyEquivalent,
  billingCycle,
  isCurrentTier,
  isFeatured,
  onSelect,
}: TierCardProps) {
  const TierIcon = tier === 'free' ? Zap : tier === 'creator' ? Droplet : Crown;
  
  const perInkCost = monthlyEquivalent > 0 
    ? (monthlyEquivalent / features.monthlyInk).toFixed(3)
    : '0';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative p-8 rounded-2xl backdrop-blur-xl
        ${isFeatured 
          ? 'bg-[#57f1d6]/10 border-2 border-[#57f1d6] ring-2 ring-[#57f1d6]/30' 
          : 'bg-white/5 border border-white/10'
        }
        ${isFeatured ? 'md:-mt-4 md:pb-12' : ''}
      `}
    >
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#57f1d6] text-[#0C0C0D] text-sm font-medium rounded-full">
          Most Popular
        </div>
      )}
      
      {/* Current Tier Badge */}
      {isCurrentTier && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30">
          Current Plan
        </div>
      )}
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${
            isFeatured ? 'bg-[#57f1d6]/20' : 'bg-white/10'
          }`}>
            <TierIcon className={`w-6 h-6 ${
              isFeatured ? 'text-[#57f1d6]' : 'text-white/60'
            }`} />
          </div>
          <h3 className="text-2xl font-bold text-white capitalize">{tier}</h3>
        </div>
        
        <div className="mb-2">
          {price === 0 ? (
            <p className="text-4xl font-bold text-white">Free</p>
          ) : (
            <div>
              <p className="text-4xl font-bold text-white">
                ${billingCycle === 'annual' ? monthlyEquivalent.toFixed(0) : price}
                <span className="text-lg text-white/60">/mo</span>
              </p>
              {billingCycle === 'annual' && (
                <p className="text-sm text-white/40 mt-1">
                  ${price}/year (save ${(price / 12 * 2).toFixed(0)})
                </p>
              )}
            </div>
          )}
        </div>
        
        {price > 0 && (
          <p className="text-sm text-white/60">
            ${perInkCost} per INK — better value than packs
          </p>
        )}
      </div>
      
      {/* Features */}
      <div className="space-y-4 mb-8">
        <FeatureItem
          icon={<Droplet className="w-4 h-4" fill="currentColor" />}
          text={`${features.monthlyInk} INK/month`}
          highlight
        />
        <FeatureItem
          icon={<Check className="w-4 h-4" />}
          text={`${features.models.join(', ')} models`}
        />
        <FeatureItem
          icon={<Check className="w-4 h-4" />}
          text={`${features.rolloverDays}-day rollover`}
        />
        <FeatureItem
          icon={<Check className="w-4 h-4" />}
          text={features.exportsQuality === 'low-res-watermark' 
            ? 'Low-res exports (watermarked)' 
            : 'Full-res exports (no watermark)'}
        />
        {features.includedUpscales > 0 && (
          <FeatureItem
            icon={<Check className="w-4 h-4" />}
            text={`${features.includedUpscales} free 2x upscales/mo`}
          />
        )}
        <FeatureItem
          icon={<Check className="w-4 h-4" />}
          text={`${features.queuePriority} queue`}
        />
        
        {/* Ask TaTTTy Costs */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <p className="text-xs text-white/40 uppercase tracking-wider">Ask TaTTTy</p>
          <FeatureItem
            icon={<Zap className="w-3.5 h-3.5" />}
            text={`Optimize: ${features.askTaTTTyCosts.optimize === 'free' ? 'Free' : features.askTaTTTyCosts.optimize + ' INK'}`}
            small
          />
          <FeatureItem
            icon={<Zap className="w-3.5 h-3.5" />}
            text={`Idea: ${features.askTaTTTyCosts.idea === 'free' ? 'Free' : features.askTaTTTyCosts.idea + ' INK'}`}
            small
          />
        </div>
      </div>
      
      {/* CTA Button */}
      <button
        onClick={onSelect}
        disabled={isCurrentTier}
        className={`
          w-full py-3 rounded-lg font-medium transition-all
          ${isCurrentTier
            ? 'bg-white/10 text-white/40 cursor-not-allowed'
            : isFeatured
            ? 'bg-[#57f1d6] text-[#0C0C0D] hover:bg-[#57f1d6]/90'
            : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
          }
        `}
      >
        {isCurrentTier ? 'Current Plan' : tier === 'free' ? 'Start Free' : 'Upgrade Now'}
      </button>
    </motion.div>
  );
}

// ============================================================================
// FEATURE ITEM
// ============================================================================

interface FeatureItemProps {
  icon: React.ReactNode;
  text: string;
  highlight?: boolean;
  small?: boolean;
}

function FeatureItem({ icon, text, highlight, small }: FeatureItemProps) {
  return (
    <div className={`flex items-start gap-3 ${small ? 'text-xs' : 'text-sm'}`}>
      <div className={`flex-shrink-0 ${
        highlight ? 'text-[#57f1d6]' : 'text-white/60'
      } mt-0.5`}>
        {icon}
      </div>
      <span className={highlight ? 'text-white font-medium' : 'text-white/80'}>
        {text}
      </span>
    </div>
  );
}

// ============================================================================
// TOKEN PACK CARD
// ============================================================================

interface TokenPackCardProps {
  pack: typeof TOKEN_PACKS[0];
  onPurchase: () => void;
}

function TokenPackCard({ pack, onPurchase }: TokenPackCardProps) {
  return (
    <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-[#57f1d6]/30 transition-all group">
      <div className="mb-4">
        <h4 className="text-white font-medium mb-1">{pack.name}</h4>
        <p className="text-3xl font-bold text-[#57f1d6]">{pack.ink} INK</p>
      </div>
      
      <div className="mb-4 space-y-1 text-sm">
        <div className="flex justify-between text-white/60">
          <span>Price:</span>
          <span className="text-white">${pack.priceUsd}</span>
        </div>
        <div className="flex justify-between text-white/60">
          <span>Per INK:</span>
          <span className="text-white/40">${pack.perInkCost.toFixed(3)}</span>
        </div>
        <div className="flex justify-between text-white/60">
          <span>Expires:</span>
          <span className="text-white/40">{pack.expiryDays}d</span>
        </div>
      </div>
      
      <button
        onClick={onPurchase}
        className="w-full py-2 bg-white/10 text-white rounded-lg text-sm font-medium border border-white/20 hover:bg-white/20 hover:border-[#57f1d6]/30 transition-all group-hover:text-[#57f1d6]"
      >
        Buy Now
      </button>
    </div>
  );
}

// ============================================================================
// VALUE PROP
// ============================================================================

interface ValuePropProps {
  title: string;
  description: string;
}

function ValueProp({ title, description }: ValuePropProps) {
  return (
    <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
      <h4 className="text-white font-medium mb-2">{title}</h4>
      <p className="text-white/60 text-sm">{description}</p>
    </div>
  );
}
