import { useState, useEffect } from 'react';
import { SidebarTips } from './SidebarTips';
import { 
  FollowUs, 
  ExclusiveDeals, 
  ReferralDiscount, 
  TokenPacks, 
  LiveActivity, 
  ComingSoon, 
  GetFeatured, 
  GetInspired 
} from './gen-sidebar';

interface GeneratorSidebarProps {
  children: React.ReactNode;
  selectedGenerator?: string;
  freestyleInitialText?: string;
  freestyleInitialImages?: File[];
}

export function GeneratorSidebar({ children, selectedGenerator, freestyleInitialText, freestyleInitialImages }: GeneratorSidebarProps) {
  
  return (
    <div 
      className="lg:h-full lg:overflow-y-auto space-y-4 md:space-y-6 pl-[10px] pr-[10px] pt-[120px] pb-8"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      <style>{`
        .lg\:h-full::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      {/* Social Media Links */}
      <FollowUs />
      
      {/* Email Signup */}
      <ExclusiveDeals />
      
      {/* Referral Section */}
      <ReferralDiscount />

      {/* Token Packs */}
      <TokenPacks />

      {/* Live Activity Feed */}
      <LiveActivity />
      
      {/* Coming Soon Section */}
      <ComingSoon />
      
      {children}
      
      <div style={{ paddingTop: '100px' }}>
        <SidebarTips />
      </div>
      
      {/* Featured Design */}
      <GetFeatured />
      
      {/* Inspiration Gallery */}
      <GetInspired />
      
      {/* Extra padding at bottom so you can scroll past everything */}
      <div className="h-20"></div>
    </div>
  );
}
