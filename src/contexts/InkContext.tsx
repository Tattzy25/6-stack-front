import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import type {
  SubscriptionTier,
  InkTransaction,
  TransactionType,
  ModelType,
  EditActionType,
  AskTaTTTyActionType,
  ControlToolType,
} from '../types/economy';
import {
  calculateGenerationCost,
  formatInkBalance,
  canAffordAction,
  getAskTaTTTyCost,
  TIER_FEATURES,
  EDIT_ACTION_CONFIGS,
} from '../types/economy';
import { env } from '../utils/env';

// ============================================================================
// TYPES
// ============================================================================

interface InkContextValue {
  // Balance
  balance: number;
  tier: SubscriptionTier;
  formattedBalance: string;
  
  // Balance queries
  canAfford: (requiredInk: number) => boolean;
  getBalanceWithEstimate: () => string;
  
  // Transactions
  deductInk: (params: DeductInkParams) => Promise<DeductInkResult>;
  refundInk: (transactionId: string, reason: string) => Promise<void>;
  addBonusInk: (amount: number, source: TransactionType) => Promise<void>;
  
  // Usage tracking (for tier limits)
  usageToday: UsageToday;
  
  // Helpers
  getGenerationCost: (model: ModelType, controls?: ControlToolType[]) => number;
  getEditCost: (action: EditActionType) => number;
  getAskTaTTTyActionCost: (action: AskTaTTTyActionType) => number | 'free';
  getUpscaleCost: (upscaleType: '2x' | '4x') => number | 'free'; // Returns 'free' if included upscales available
  hasIncludedUpscalesRemaining: () => boolean;
  
  // Loading states
  isDeducting: boolean;
  lastTransaction: InkTransaction | null;
  
  // Refresh
  refreshBalance: () => Promise<void>;
}

interface DeductInkParams {
  amount: number;
  type: TransactionType;
  metadata?: Record<string, any>;
}

interface DeductInkResult {
  success: boolean;
  transaction?: InkTransaction;
  error?: string;
  balanceAfter?: number;
}

interface UsageToday {
  ideas: number;
  brainstormMessages: number;
  upscales2x: number; // Tracks 2x upscales for included upscales feature
}

// ============================================================================
// CONTEXT
// ============================================================================

const InkContext = createContext<InkContextValue | null>(null);

export function useInk(): InkContextValue {
  const context = useContext(InkContext);
  if (!context) {
    throw new Error('useInk must be used within InkProvider');
  }
  return context;
}

// ============================================================================
// PROVIDER
// ============================================================================

interface InkProviderProps {
  children: React.ReactNode;
}

export function InkProvider({ children }: InkProviderProps) {
  const { user, isAuthenticated } = useAuth();
  const apiBase = (env.apiUrl || '/api').replace(/\/$/, '');
  
  const [balance, setBalance] = useState<number>(0);
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [usageToday, setUsageToday] = useState<UsageToday>({
    ideas: 0,
    brainstormMessages: 0,
    upscales2x: 0,
  });
  const [isDeducting, setIsDeducting] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<InkTransaction | null>(null);
  
  // ============================================================================
  // FETCH BALANCE
  // ============================================================================
  
  const refreshBalance = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setBalance(0);
      setTier('free');
      return;
    }
    
    try {
      // TODO: Replace with actual API call to Neon database
      const response = await fetch(`${apiBase}/ink/balance?userId=${user.id}`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch balance');
      }
      
      const data = await response.json();
      
      setBalance(data.balance || 0);
      setTier(data.tier || 'free');
      setUsageToday(data.usageToday || { ideas: 0, brainstormMessages: 0, upscales2x: 0 });
    } catch (error) {
      console.error('Error fetching INK balance:', error);
      
      // Fallback to local state for development
      // In production, you should handle this differently
      const localBalance = parseInt(localStorage.getItem('dev_ink_balance') || '100', 10);
      const localTier = (localStorage.getItem('dev_tier') || 'free') as SubscriptionTier;
      
      setBalance(localBalance);
      setTier(localTier);
    }
  }, [isAuthenticated, user?.id]);
  
  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);
  
  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================
  
  const formattedBalance = formatInkBalance(balance, tier);
  
  // ============================================================================
  // BALANCE QUERIES
  // ============================================================================
  
  const canAfford = useCallback(
    (requiredInk: number): boolean => {
      return canAffordAction(balance, requiredInk);
    },
    [balance]
  );
  
  const getBalanceWithEstimate = useCallback((): string => {
    return formattedBalance;
  }, [formattedBalance]);
  
  // ============================================================================
  // DEDUCT INK
  // ============================================================================
  
  const deductInk = useCallback(
    async (params: DeductInkParams): Promise<DeductInkResult> => {
      if (!isAuthenticated || !user?.id) {
        return {
          success: false,
          error: 'User not authenticated',
        };
      }
      
      if (!canAfford(params.amount)) {
        return {
          success: false,
          error: 'Insufficient INK balance',
        };
      }
      
      setIsDeducting(true);
      
      try {
        // TODO: Replace with actual API call to Neon database
        const response = await fetch(`${apiBase}/ink/deduct`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            userId: user.id,
            amount: params.amount,
            type: params.type,
            metadata: params.metadata,
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to deduct INK');
        }
        
        const data = await response.json();
        const transaction: InkTransaction = data.transaction;
        
        setBalance(transaction.balanceAfter);
        setLastTransaction(transaction);
        
        // Update usage counters locally
        if (params.type === 'ask-tattty') {
          const action = params.metadata?.actionType as AskTaTTTyActionType;
          if (action === 'idea') {
            setUsageToday(prev => ({ ...prev, ideas: prev.ideas + 1 }));
          } else if (action === 'brainstorm') {
            setUsageToday(prev => ({ ...prev, brainstormMessages: prev.brainstormMessages + 10 }));
          }
        } else if (params.type === 'edit') {
          const editAction = params.metadata?.actionType as EditActionType;
          if (editAction === 'upscale-2x-fast' || editAction === 'upscale-2x-conservative') {
            setUsageToday(prev => ({ ...prev, upscales2x: prev.upscales2x + 1 }));
          }
        }
        
        return {
          success: true,
          transaction,
          balanceAfter: transaction.balanceAfter,
        };
      } catch (error) {
        console.error('Error deducting INK:', error);
        
        // Fallback for development - deduct from local storage
        const newBalance = balance - params.amount;
        localStorage.setItem('dev_ink_balance', newBalance.toString());
        setBalance(newBalance);
        
        const fallbackTransaction: InkTransaction = {
          id: `local-${Date.now()}`,
          userId: user.id,
          type: params.type,
          amount: -params.amount,
          balanceBefore: balance,
          balanceAfter: newBalance,
          metadata: params.metadata,
          createdAt: new Date(),
        };
        
        setLastTransaction(fallbackTransaction);
        
        return {
          success: true,
          transaction: fallbackTransaction,
          balanceAfter: newBalance,
        };
      } finally {
        setIsDeducting(false);
      }
    },
    [isAuthenticated, user?.id, balance, canAfford]
  );
  
  // ============================================================================
  // REFUND INK
  // ============================================================================
  
  const refundInk = useCallback(
    async (transactionId: string, reason: string): Promise<void> => {
      if (!isAuthenticated || !user?.id) {
        return;
      }
      
      try {
        // TODO: Replace with actual API call
        const response = await fetch('/api/ink/refund', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            transactionId,
            reason,
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to refund INK');
        }
        
        const data = await response.json();
        setBalance(data.balanceAfter);
        
        // Show success toast
        console.log(`Refunded ${data.amount} INK due to: ${reason}`);
      } catch (error) {
        console.error('Error refunding INK:', error);
      }
    },
    [isAuthenticated, user?.id]
  );
  
  // ============================================================================
  // ADD BONUS INK
  // ============================================================================
  
  const addBonusInk = useCallback(
    async (amount: number, source: TransactionType): Promise<void> => {
      if (!isAuthenticated || !user?.id) {
        return;
      }
      
      try {
        // TODO: Replace with actual API call
        const response = await fetch('/api/ink/bonus', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            amount,
            source,
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to add bonus INK');
        }
        
        const data = await response.json();
        setBalance(data.balanceAfter);
      } catch (error) {
        console.error('Error adding bonus INK:', error);
      }
    },
    [isAuthenticated, user?.id]
  );
  
  // ============================================================================
  // HELPER METHODS
  // ============================================================================
  
  const getGenerationCost = useCallback(
    (model: ModelType, controls: ControlToolType[] = []): number => {
      return calculateGenerationCost(model, controls);
    },
    []
  );
  
  const getEditCost = useCallback((action: EditActionType): number => {
    return EDIT_ACTION_CONFIGS[action].inkCost;
  }, []);
  
  const getAskTaTTTyActionCost = useCallback(
    (action: AskTaTTTyActionType): number | 'free' => {
      return getAskTaTTTyCost(tier, action, usageToday);
    },
    [tier, usageToday]
  );
  
  const hasIncludedUpscalesRemaining = useCallback((): boolean => {
    const includedUpscales = TIER_FEATURES[tier].includedUpscales;
    return includedUpscales > 0 && usageToday.upscales2x < includedUpscales;
  }, [tier, usageToday.upscales2x]);
  
  const getUpscaleCost = useCallback(
    (upscaleType: '2x' | '4x'): number | 'free' => {
      // 4x upscales are never included
      if (upscaleType === '4x') {
        return EDIT_ACTION_CONFIGS['upscale-4x-creative'].inkCost;
      }
      
      // Check if user has included 2x upscales remaining
      if (hasIncludedUpscalesRemaining()) {
        return 'free';
      }
      
      return EDIT_ACTION_CONFIGS['upscale-2x-fast'].inkCost;
    },
    [hasIncludedUpscalesRemaining]
  );
  
  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================
  
  const value: InkContextValue = {
    balance,
    tier,
    formattedBalance,
    canAfford,
    getBalanceWithEstimate,
    deductInk,
    refundInk,
    addBonusInk,
    usageToday,
    getGenerationCost,
    getEditCost,
    getAskTaTTTyActionCost,
    getUpscaleCost,
    hasIncludedUpscalesRemaining,
    isDeducting,
    lastTransaction,
    refreshBalance,
  };
  
  return <InkContext.Provider value={value}>{children}</InkContext.Provider>;
}
