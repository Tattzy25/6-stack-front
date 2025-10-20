import { Droplet, ArrowRight } from 'lucide-react';
import { useInk } from '../../contexts/InkContext';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import { TIER_FEATURES } from '../../types/economy';

interface InkBalancePillProps {
  onNavigate?: (page: string) => void;
}

export function InkBalancePill({ onNavigate }: InkBalancePillProps) {
  const { balance, tier } = useInk();
  
  // Determine color based on balance level
  const tierInk = TIER_FEATURES[tier].monthlyInk;
  const balancePercent = (balance / tierInk) * 100;
  
  const colorClass = 
    balancePercent > 50 
      ? 'bg-[#57f1d6]/10 border-[#57f1d6]/30 text-[#57f1d6]'
      : balancePercent > 20
      ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
      : 'bg-red-500/10 border-red-500/30 text-red-400';
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full
            border backdrop-blur-sm
            transition-all duration-300
            hover:scale-105 hover:shadow-lg
            ${colorClass}
          `}
        >
          <Droplet className="w-4 h-4" fill="currentColor" />
          <span className="font-mono">{balance} INK</span>
        </button>
      </PopoverTrigger>
      <PopoverContent 
        side="bottom"
        align="start"
        className="bg-[#0C0C0D]/95 backdrop-blur-xl border border-[#57f1d6]/20 p-6 w-80"
      >
        <div className="space-y-4">
          {/* Balance Display - Bigger Text */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <Droplet className="w-8 h-8 text-[#57f1d6]" fill="#57f1d6" />
              <span className="text-5xl font-bold text-white font-mono">{balance}</span>
              <span className="text-2xl text-white/60">INK</span>
            </div>
            <p className="text-sm text-white/60 capitalize">
              {tier} Plan • {TIER_FEATURES[tier].rolloverDays}-day rollover
            </p>
          </div>
          
          {/* See Full List Button */}
          <button
            onClick={() => onNavigate?.('pricing')}
            className="
              w-full py-3 px-4 rounded-lg
              bg-[#57f1d6]/10 border border-[#57f1d6]/30
              text-[#57f1d6] font-medium
              hover:bg-[#57f1d6]/20 hover:border-[#57f1d6]/50
              transition-all duration-200
              flex items-center justify-center gap-2
              group
            "
          >
            <span>See Full Breakdown</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
