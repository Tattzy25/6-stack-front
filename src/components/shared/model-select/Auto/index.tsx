import { Zap, Droplet, Lock } from 'lucide-react';
import { cn } from '../../../ui/utils';
import type { BaseModelOptionProps } from '../types';

export function AutoModelOption({ id, label, subtitle, selected, onSelect, className, disabled, inkCost, estimatedSeconds, locked, lockReason }: BaseModelOptionProps) {
  return (
    <button
      onClick={() => !disabled && onSelect(id)}
      disabled={disabled}
      className={cn(
        'relative p-4 rounded-lg border backdrop-blur-sm transition-all duration-200 flex flex-col items-center justify-center text-center',
        selected
          ? 'bg-[#57f1d6]/10 border-[#57f1d6]/30 ring-2 ring-[#57f1d6] ring-offset-2 ring-offset-[#0C0C0D]'
          : 'bg-white/5 border-white/10 hover:border-[#57f1d6]/20 hover:bg-white/10',
        locked && 'opacity-60 cursor-not-allowed',
        className
      )}
    >
      {locked && (
        <div className="absolute top-2 right-2 flex items-center gap-1 text-white/70">
          <Lock className="w-4 h-4" />
        </div>
      )}
      <div className="flex items-center gap-3">
        <Zap className="w-5 h-5 text-[#57f1d6]" />
        <p className={cn('font-medium truncate', selected ? 'text-[#57f1d6]' : 'text-white')}>{label}</p>
      </div>
      {(inkCost !== undefined || estimatedSeconds) && (
        <div className="mt-1 text-xs text-white/80 flex items-center gap-2">
          {inkCost !== undefined && (
            <span className="flex items-center gap-1">
              <Droplet className="w-3.5 h-3.5" fill="currentColor" />
              {inkCost} INK
            </span>
          )}
          {estimatedSeconds && (
            <span>({estimatedSeconds[0]}-{estimatedSeconds[1]}s)</span>
          )}
        </div>
      )}
      {locked && lockReason && (
        <span className="mt-1 text-[10px] text-white/60">{lockReason}</span>
      )}
    </button>
  );
}