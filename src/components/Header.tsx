import { Button } from './ui/button';
import { NavigationMenu } from './NavigationMenu';
import { User, Home, Wand2, Skull, Droplet, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
// InkBalancePill removed from header
import { useInk } from '../contexts/InkContext';
import { TIER_FEATURES } from '../types/economy';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const { isAuthenticated, user } = useAuth();
  const { balance, tier } = useInk();
  const userType = 'user'; // 'user' or 'artist' - can be extended later
  // admin crown removed

  return (
    <header className="fixed top-0 left-0 right-0 z-50 my-[0px] m-[0px]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 my-[30px] py-[40px] mx-[0px] px-[0px] py-[30px]">
          {/* Left section removed: INK badge */}
          <div className="flex-1" />
          
          {/* Center: Navigation Icons */}
          <div className="flex items-center gap-8">
            {/* Admin button removed */}

            {/* Home Icon */}
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center justify-center w-14 h-14 rounded-xl hover:opacity-80 transition-opacity"
              style={{
                background: 'rgba(0, 0, 0, 0.6)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.8)',
              }}
            >
              <Home size={28} className="text-white" />
            </button>

            {/* INK Balance Skull Icon - Only when authenticated */}
            {isAuthenticated && (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className="flex items-center justify-center w-14 h-14 rounded-xl hover:opacity-80 transition-opacity"
                    style={{
                      background: 'rgba(0, 0, 0, 0.6)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.8)',
                    }}
                  >
                    <Skull size={28} className="text-white" />
                  </button>
                </PopoverTrigger>
                <PopoverContent 
                  side="bottom"
                  align="center"
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
                      onClick={() => onNavigate('pricing')}
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
            )}

            {/* Wand Icon */}
            <button
              onClick={() => onNavigate('generate')}
              className="flex items-center justify-center w-14 h-14 rounded-xl hover:opacity-80 transition-opacity"
              style={{
                background: 'rgba(0, 0, 0, 0.6)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.8)',
              }}
            >
              <Wand2 size={28} className="text-white" />
            </button>

            {/* Navigation Menu */}
            <div 
              className="flex items-center justify-center w-14 h-14 rounded-xl"
              style={{
                background: 'rgba(0, 0, 0, 0.6)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.8)',
              }}
            >
              <NavigationMenu 
                onNavigate={onNavigate} 
                currentPage={currentPage}
                variant="icon"
              />
            </div>

            {/* User Icon - Auth Status Indicator */}
            <button
              onClick={() => isAuthenticated ? onNavigate('dashboard') : onNavigate('auth')}
              className="flex items-center justify-center w-14 h-14 rounded-xl hover:opacity-80 transition-opacity relative"
              style={{
                background: isAuthenticated ? 'rgba(87, 241, 214, 0.2)' : 'rgba(0, 0, 0, 0.6)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.8)',
              }}
            >
              <User size={28} className={isAuthenticated ? 'text-[#57f1d6]' : 'text-white'} />
              {isAuthenticated && (
                <div 
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                  style={{ backgroundColor: '#57f1d6' }}
                />
              )}
            </button>
          </div>
          
          {/* Right: Spacer for balance */}
          <div className="flex-1" />
        </div>
      </div>
    </header>
  );
}