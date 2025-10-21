import { Zap } from 'lucide-react';
import { cn } from '../../../ui/utils';
import { AspectRatio } from '../../../ui/aspect-ratio';
import type { BaseModelOptionProps } from '../types';

export function AutoModelOption({ id, label, subtitle, badge, selected, onSelect, className, layout, inkCost }: BaseModelOptionProps) {
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
    textShadow: '0 1px 2px #000, 0 2px 8px rgba(0,0,0,0.55)'
  } as React.CSSProperties;

  const content = (
    <div className="relative w-full h-full">
      <button
          onClick={() => onSelect(id)}
          className={cn(
            'relative w-full h-full p-4 border-2 transition-all duration-200 flex flex-col items-center justify-center text-center',
            className
          )}
          style={selected ? selectedStyle : baseStyle}
        >
        {/* Badge positioned at right edge of the card */}
        {badge && (
          <span className="absolute -top-2 right-3 px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-[#57f1d6] to-[#00d4ff] text-black border border-[#57f1d6]/40 shadow-[0_0_30px_rgba(87,241,214,0.3)] z-10">
            {badge}
          </span>
        )}

        {/* Centered two-row text */}
        <div className="flex flex-col items-center justify-center w-full h-full text-center gap-1">
          <div className="flex items-center justify-center gap-2">
            <Zap className="w-4.5 h-4.5 text-[#57f1d6]" />
            <p className={cn('text-base font-medium', selected ? 'text-[#57f1d6]' : 'text-white')} style={textStyle}>{label}</p>
          </div>
          <p className="text-xs text-white/75" style={textStyle}>{subtitle}</p>
        </div>
      </button>
    </div>
  );

  if (layout === 'wide') {
    return <div className="w-full h-24 sm:h-28 relative">{content}</div>;
  }
  return <AspectRatio ratio={1} className="relative">{content}</AspectRatio>;
}