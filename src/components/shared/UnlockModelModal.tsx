import { useState } from 'react';
import { Crown, Sparkles, Zap, X } from 'lucide-react';
import { UpgradeNudge } from './UpgradeNudge';
import type { SubscriptionTier } from '../../types/economy';
import { toast } from 'sonner';

export interface UnlockModelModalOptions {
  modelId: string;
  modelLabel: string;
  targetTier: 'creator' | 'studio';
  encouragement?: string;
  onBoost: () => Promise<void> | void;
  onSubscribe: (tier: SubscriptionTier) => void;
  onClose?: () => void;
}

interface UnlockModelModalProps extends UnlockModelModalOptions {
  onClose: () => void;
}

export function UnlockModelModal({
  modelLabel,
  targetTier,
  encouragement = 'Turbo pushes max detail — unlock it for this piece.',
  onBoost,
  onSubscribe,
  onClose,
}: UnlockModelModalProps) {
  const [isBoosting, setIsBoosting] = useState(false);

  const handleBoost = async () => {
    try {
      setIsBoosting(true);
      await onBoost();
      toast.success(`${modelLabel} unlocked for this run`);
      onClose();
    } catch (error) {
      console.error('Unlock boost failed', error);
      toast.error('Could not complete the boost. Please try again.');
    } finally {
      setIsBoosting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-[#0C0C0D]/95 shadow-[0_0_60px_rgba(87,241,214,0.2)]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/60 transition-colors hover:text-white"
          aria-label="Close unlock modal"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="space-y-6 p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#57f1d6]/15">
              <Sparkles className="h-6 w-6 text-[#57f1d6]" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/40">Unlock Premium Detail</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                {modelLabel} is ready — pick how you want to access it.
              </h2>
              <p className="mt-3 text-sm text-white/70">{encouragement}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <button
              onClick={handleBoost}
              disabled={isBoosting}
              className="group flex flex-col items-start gap-3 rounded-2xl border border-transparent bg-gradient-to-br from-[#57f1d6]/90 to-[#00d4ff]/80 p-5 text-left transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(87,241,214,0.25)] disabled:cursor-wait"
            >
              <div className="flex items-center gap-2 text-[#001f1a]">
                <Zap className="h-5 w-5" />
                <span className="text-sm font-semibold uppercase tracking-wide">Turbo Boost</span>
              </div>
              <p className="text-2xl font-bold text-[#001f1a]">$5.99</p>
              <p className="text-sm text-[#033831]">
                One-time access for this design. Keeps you on your current membership.
              </p>
              <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#001f1a]/10 px-3 py-1 text-xs text-[#001f1a]/80">
                <Sparkles className="h-3.5 w-3.5" />
                Instant unlock
              </span>
            </button>

            <div className="h-full rounded-2xl border border-white/15 bg-white/5 p-4">
              <UpgradeNudge
                targetTier={targetTier}
                feature={`${targetTier === 'studio' ? 'Turbo' : 'Premium'} models`}
                variant="card"
                onUpgrade={() => onSubscribe(targetTier)}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3 text-sm text-white/70">
              <Crown className="h-4 w-4 text-[#57f1d6]" />
              <span>Want to stick with Free? No problem — keep browsing or come back later.</span>
            </div>
            <button
              onClick={onClose}
              className="text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              Keep exploring
            </button>
          </div>

          <p className="text-xs text-white/40">
            Most styles are welcome. We only moderate prompts that break platform rules so the community stays safe.
          </p>
        </div>
      </div>
    </div>
  );
}
