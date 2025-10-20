import { Sparkles } from 'lucide-react';

interface SelectTaTTTyProps {
  isSelected: boolean;
  onClick: () => void;
}

export function SelectTaTTTy({ isSelected, onClick }: SelectTaTTTyProps) {
  return (
    <div
      onClick={onClick}
      className="rounded-lg border-2 transition-all text-left border-border px-[0px] p-[12px] cursor-pointer"
      style={isSelected ? {
        background: 'rgba(87, 241, 214, 0.15)',
        borderColor: '#57f1d6',
        boxShadow: '0 0 20px rgba(87, 241, 214, 0.4), 0 0 40px rgba(87, 241, 214, 0.2), 0 8px 24px rgba(0, 0, 0, 0.8)',
      } : {
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.8)',
      }}
    >
      <div className="flex flex-col items-center text-center gap-2 px-[0px] py-[10px]">
        <Sparkles 
          size={24} 
          className="text-muted-foreground" 
          style={{ filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.8))' }}
        />
        <div>
          <div className="text-sm text-[16px] font-[Orbitron]" style={{ letterSpacing: '3px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>
            TaTTTy
          </div>
        </div>
      </div>
    </div>
  );
}
