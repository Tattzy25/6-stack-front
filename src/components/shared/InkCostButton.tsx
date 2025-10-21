import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Droplet, Lock, Loader2 } from 'lucide-react';
import { useInk } from '../../contexts/InkContext';
import { cn } from '../../components/ui/utils';

interface InkCostButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  inkCost: number | 'free';
  label: string;
  estimatedTime?: string; // e.g., "2-5s"
  isLocked?: boolean;
  lockReason?: string;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  showInkIcon?: boolean;
}

export const InkCostButton = forwardRef<HTMLButtonElement, InkCostButtonProps>(
  (
    {
      inkCost,
      label,
      estimatedTime,
      isLocked = false,
      lockReason,
      isLoading = false,
      variant = 'primary',
      showInkIcon = true,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const { balance, canAfford } = useInk();
    
    const numericCost = inkCost === 'free' ? 0 : inkCost;
    const canUserAfford = canAfford(numericCost);
    const isVisuallyDisabled = isLocked || !canUserAfford;
    const isActuallyDisabled = disabled || isLoading;
    
    // Determine button styling based on variant and state
    const variantClasses = {
      primary: 'bg-[#57f1d6] text-[#0C0C0D] hover:bg-[#57f1d6]/90',
      secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20',
      danger: 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30',
    };
    
    const disabledClasses = isActuallyDisabled
      ? 'opacity-50 cursor-not-allowed hover:bg-opacity-100'
      : '';
    
    const lockIconColor = variant === 'primary' ? '#0C0C0D' : 'currentColor';
    
    return (
      <button
        ref={ref}
        disabled={isActuallyDisabled}
        aria-disabled={isVisuallyDisabled}
        className={cn(
          'relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg',
          'transition-all duration-200 cursor-pointer',
          variantClasses[variant],
          isVisuallyDisabled && !isActuallyDisabled && 'opacity-60',
          disabledClasses,
          'group',
          className
        )}
        {...props}
      >
        {/* Loading State */}
        {isLoading && (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
        
        {/* Locked State */}
        {isLocked && !isLoading && (
          <Lock className="w-4 h-4" style={{ color: lockIconColor }} />
        )}
        
        {/* Label */}
        <span className="font-medium">{label}</span>
        
        {/* INK Cost Display */}
        {!isLocked && !isLoading && (
          <span className="flex items-center gap-1 ml-1">
            {inkCost === 'free' ? (
              <span className="text-xs opacity-80">Free</span>
            ) : (
              <>
                {showInkIcon && (
                  <Droplet className="w-3.5 h-3.5" fill="currentColor" />
                )}
                <span className="text-xs opacity-80">{inkCost} credits</span>
              </>
            )}
          </span>
        )}
        
        {/* Estimated Time */}
        {estimatedTime && !isLocked && !isLoading && (
          <span className="text-xs opacity-60 ml-1">
            ({estimatedTime})
          </span>
        )}
        
        {/* Insufficient Balance Indicator */}
        {!isLocked && !canUserAfford && numericCost > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            Need {numericCost - balance} more
          </span>
        )}
        
        {/* Lock Reason Tooltip */}
        {isLocked && lockReason && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-black/90 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {lockReason}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-black/90" />
          </div>
        )}
      </button>
    );
  }
);

InkCostButton.displayName = 'InkCostButton';
