import { Zap, Flame } from 'lucide-react';

export function TokenPacks() {
  return (
    <div style={{ paddingTop: '100px' }}>
      <div className="w-full text-center mb-8" style={{ fontFamily: 'Rock Salt, cursive' }}>
        <div className="text-[40px]" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.9), 0 8px 24px rgba(0, 0, 0, 0.8)' }}>TOKEN</div>
        <div className="text-[48px]" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.9), 0 8px 24px rgba(0, 0, 0, 0.8)' }}>PACKS</div>
      </div>
      
      <div className="space-y-3">
        {/* Starter Pack */}
        <button
          className="w-full p-4 rounded-2xl border-2 border-accent/20 hover:border-accent/50 transition-all group"
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            background: 'linear-gradient(90deg, hsla(0, 0%, 100%, 0.2), hsla(0, 0%, 100%, 0.05))',
            boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap size={24} className="text-accent" />
              <div className="text-left">
                <p className="text-[18px] font-[Orbitron]">Starter Pack</p>
                <p className="text-[14px] text-foreground/70">50 tokens</p>
              </div>
            </div>
            <p className="text-[20px] font-[Orbitron] text-accent">$9</p>
          </div>
        </button>

        {/* Pro Pack */}
        <button
          className="w-full p-4 rounded-2xl border-2 border-accent/40 hover:border-accent/60 transition-all group relative overflow-hidden"
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            background: 'linear-gradient(90deg, hsla(0, 0%, 100%, 0.25), hsla(0, 0%, 100%, 0.1))',
            boxShadow: '0 0 40px rgba(87, 241, 214, 0.3)'
          }}
        >
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-accent/90 rounded-full text-[10px] text-background font-[Orbitron]">
            POPULAR
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flame size={24} className="text-accent" />
              <div className="text-left">
                <p className="text-[18px] font-[Orbitron]">Pro Pack</p>
                <p className="text-[14px] text-foreground/70">150 tokens</p>
              </div>
            </div>
            <p className="text-[20px] font-[Orbitron] text-accent">$24</p>
          </div>
        </button>

        {/* Legend Pack */}
        <button
          className="w-full p-4 rounded-2xl border-2 border-accent/20 hover:border-accent/50 transition-all group"
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            background: 'linear-gradient(90deg, hsla(0, 0%, 100%, 0.2), hsla(0, 0%, 100%, 0.05))',
            boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap size={24} className="text-accent" />
              <div className="text-left">
                <p className="text-[18px] font-[Orbitron]">Legend Pack</p>
                <p className="text-[14px] text-foreground/70">500 tokens</p>
              </div>
            </div>
            <p className="text-[20px] font-[Orbitron] text-accent">$69</p>
          </div>
        </button>
      </div>
    </div>
  );
}
