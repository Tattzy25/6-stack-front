import { CheckCircle2, X } from 'lucide-react';

interface SavedInputIndicatorProps {
  generatorType: string;
  preview: string; // First 50 chars or so
  onClear?: () => void;
}

export function SavedInputIndicator({ generatorType, preview, onClear }: SavedInputIndicatorProps) {
  const getTitle = () => {
    switch (generatorType) {
      case 'tattty':
        return 'TaTTTy';
      case 'freestyle':
        return 'Freestyle';
      case 'couples':
        return 'Couples';
      case 'coverup':
        return 'Cover-Up';
      case 'extend':
        return 'Extend';
      default:
        return 'Input';
    }
  };

  return (
    <div 
      className="relative overflow-hidden border-2 border-accent rounded-2xl p-4"
      style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        background: 'linear-gradient(135deg, rgba(87, 241, 214, 0.15), rgba(87, 241, 214, 0.05))',
        animation: 'pulse 2s ease-in-out infinite',
        boxShadow: '0 0 30px rgba(87, 241, 214, 0.4)',
      }}
    >
      {/* Glowing indicator dot */}
      <div 
        className="absolute top-2 right-2 w-3 h-3 rounded-full bg-accent"
        style={{
          animation: 'pulse 1.5s ease-in-out infinite',
          boxShadow: '0 0 10px rgba(87, 241, 214, 0.8)',
        }}
      />
      
      <div className="flex items-start gap-3">
        <CheckCircle2 size={24} className="text-accent flex-shrink-0 mt-0.5" />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-[Orbitron] text-accent tracking-wider">
              {getTitle().toUpperCase()} SAVED
            </h3>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 break-words font-[Roboto_Condensed]">
            {preview}
          </p>
        </div>
        
        {onClear && (
          <button
            onClick={onClear}
            className="hover:bg-accent/20 rounded-full p-1 transition-colors flex-shrink-0"
            aria-label="Clear saved input"
          >
            <X size={16} className="text-accent/70" />
          </button>
        )}
      </div>
    </div>
  );
}
