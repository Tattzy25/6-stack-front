/**
 * TaTTTy INK Economy Types & Constants
 * Defines the complete micro-economy system for TaTTTy
 */

// ============================================================================
// TIER TYPES
// ============================================================================

export type SubscriptionTier = 'free' | 'creator' | 'studio';

export type AnnualBilling = 'monthly' | 'annual';

export interface TierFeatures {
  tier: SubscriptionTier;
  monthlyInk: number;
  rolloverDays: number;
  models: ModelType[];
  exportsQuality: 'low-res-watermark' | 'full-res-no-watermark' | 'full-res';
  askTaTTTyCosts: {
    optimize: number | 'free';
    idea: number | 'free';
    brainstorm: number | 'free'; // per 10 messages
  };
  askTaTTTyLimits: {
    brainstormMessagesPerDay?: number;
    ideasPerDay?: number;
  };
  controlTools: ControlToolType[];
  includedUpscales: number; // 2x upscales per month
  queuePriority: 'standard' | 'priority' | 'top';
  license: 'personal' | 'commercial';
}

// ============================================================================
// MODEL TYPES
// ============================================================================

export type ModelType = 'flash' | 'medium' | 'large' | 'turbo';

export interface ModelConfig {
  id: ModelType;
  name: string;
  description: string;
  baseInkCost: number;
  estimatedTimeSeconds: [number, number]; // min, max
  quality: 'draft' | 'balanced' | 'detailed' | 'max-detail';
  availableInTiers: SubscriptionTier[];
}

// ============================================================================
// CONTROL TOOL TYPES
// ============================================================================

export type ControlToolType = 'sketch' | 'structure' | 'style' | 'style-transfer';

export interface ControlToolConfig {
  id: ControlToolType;
  name: string;
  inkAdder: number;
  availableInTiers: SubscriptionTier[];
}

// ============================================================================
// EDITING ACTION TYPES
// ============================================================================

export type EditActionType = 
  | 'upscale-2x-fast'
  | 'upscale-2x-conservative'
  | 'upscale-4x-creative'
  | 'inpaint'
  | 'outpaint'
  | 'erase'
  | 'remove-background'
  | 'replace-background'
  | 'relight';

export interface EditActionConfig {
  id: EditActionType;
  name: string;
  inkCost: number;
  estimatedTimeSeconds: [number, number];
  description: string;
}

// ============================================================================
// ASK TATTTY ACTION TYPES
// ============================================================================

export type AskTaTTTyActionType = 'optimize' | 'idea' | 'brainstorm';

// ============================================================================
// TOKEN PACK TYPES
// ============================================================================

export interface TokenPack {
  id: string;
  name: string;
  ink: number;
  priceUsd: number;
  perInkCost: number; // calculated
  expiryDays: number;
}

// ============================================================================
// INK TRANSACTION TYPES
// ============================================================================

export type TransactionType = 
  | 'generate'
  | 'edit'
  | 'ask-tattty'
  | 'refund'
  | 'purchase'
  | 'subscription'
  | 'bonus'
  | 'streak'
  | 'referral'
  | 'share'
  | 'rollover';

export interface InkTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number; // positive for credit, negative for debit
  balanceBefore: number;
  balanceAfter: number;
  metadata?: {
    modelType?: ModelType;
    actionType?: EditActionType | AskTaTTTyActionType;
    refundReason?: string;
    [key: string]: any;
  };
  createdAt: Date;
}

// ============================================================================
// PRICING CONSTANTS
// ============================================================================

export const TIER_PRICING: Record<SubscriptionTier, { monthly: number; annual: number }> = {
  free: { monthly: 0, annual: 0 },
  creator: { monthly: 12, annual: 108 }, // 2 months free: 12 * 10 = 120, annual = 108
  studio: { monthly: 29, annual: 290 }, // 2 months free: 29 * 10 = 290
};

export const MODEL_CONFIGS: Record<ModelType, ModelConfig> = {
  flash: {
    id: 'flash',
    name: 'Flash',
    description: 'Fast draft',
    baseInkCost: 8,
    estimatedTimeSeconds: [2, 6],
    quality: 'draft',
    availableInTiers: ['free', 'creator', 'studio'],
  },
  medium: {
    id: 'medium',
    name: 'Medium',
    description: 'Balanced',
    baseInkCost: 12,
    estimatedTimeSeconds: [6, 12],
    quality: 'balanced',
    availableInTiers: ['creator', 'studio'],
  },
  large: {
    id: 'large',
    name: 'Large',
    description: 'Detailed',
    baseInkCost: 18,
    estimatedTimeSeconds: [10, 20],
    quality: 'detailed',
    availableInTiers: ['creator', 'studio'],
  },
  turbo: {
    id: 'turbo',
    name: 'Turbo',
    description: 'Max detail',
    baseInkCost: 30,
    estimatedTimeSeconds: [15, 30],
    quality: 'max-detail',
    availableInTiers: ['studio'],
  },
};

export const CONTROL_TOOL_CONFIGS: Record<ControlToolType, ControlToolConfig> = {
  sketch: {
    id: 'sketch',
    name: 'Sketch',
    inkAdder: 4,
    availableInTiers: ['creator', 'studio'],
  },
  structure: {
    id: 'structure',
    name: 'Structure',
    inkAdder: 6,
    availableInTiers: ['creator', 'studio'],
  },
  style: {
    id: 'style',
    name: 'Style',
    inkAdder: 6,
    availableInTiers: ['creator', 'studio'],
  },
  'style-transfer': {
    id: 'style-transfer',
    name: 'Style Transfer',
    inkAdder: 8,
    availableInTiers: ['studio'],
  },
};

export const EDIT_ACTION_CONFIGS: Record<EditActionType, EditActionConfig> = {
  'upscale-2x-fast': {
    id: 'upscale-2x-fast',
    name: '2x Upscale (Fast)',
    inkCost: 4,
    estimatedTimeSeconds: [2, 5],
    description: 'Quick 2x upscale',
  },
  'upscale-2x-conservative': {
    id: 'upscale-2x-conservative',
    name: '2x Upscale (Conservative)',
    inkCost: 4,
    estimatedTimeSeconds: [3, 6],
    description: 'Preserves original details',
  },
  'upscale-4x-creative': {
    id: 'upscale-4x-creative',
    name: '4x Upscale (Creative)',
    inkCost: 6,
    estimatedTimeSeconds: [5, 10],
    description: 'High-res creative upscale',
  },
  inpaint: {
    id: 'inpaint',
    name: 'Inpaint',
    inkCost: 8,
    estimatedTimeSeconds: [4, 8],
    description: 'Fill selected areas',
  },
  outpaint: {
    id: 'outpaint',
    name: 'Outpaint',
    inkCost: 8,
    estimatedTimeSeconds: [5, 10],
    description: 'Extend image boundaries',
  },
  erase: {
    id: 'erase',
    name: 'Erase',
    inkCost: 8,
    estimatedTimeSeconds: [3, 6],
    description: 'Remove selected elements',
  },
  'remove-background': {
    id: 'remove-background',
    name: 'Remove Background',
    inkCost: 8,
    estimatedTimeSeconds: [2, 5],
    description: 'Instant background removal',
  },
  'replace-background': {
    id: 'replace-background',
    name: 'Replace Background',
    inkCost: 8,
    estimatedTimeSeconds: [4, 8],
    description: 'AI-powered background swap',
  },
  relight: {
    id: 'relight',
    name: 'Relight',
    inkCost: 8,
    estimatedTimeSeconds: [3, 7],
    description: 'Adjust lighting and mood',
  },
};

export const TOKEN_PACKS: TokenPack[] = [
  {
    id: 'starter',
    name: 'Starter',
    ink: 80,
    priceUsd: 4.99,
    perInkCost: 0.062,
    expiryDays: 180,
  },
  {
    id: 'small',
    name: 'Small',
    ink: 200,
    priceUsd: 9,
    perInkCost: 0.045,
    expiryDays: 180,
  },
  {
    id: 'medium',
    name: 'Medium',
    ink: 600,
    priceUsd: 24,
    perInkCost: 0.04,
    expiryDays: 180,
  },
  {
    id: 'large',
    name: 'Large',
    ink: 1500,
    priceUsd: 49,
    perInkCost: 0.033,
    expiryDays: 180,
  },
];

export const SESSION_BOOSTER: TokenPack = {
  id: 'session-booster',
  name: 'Session Booster',
  ink: 120,
  priceUsd: 5.99,
  perInkCost: 0.05,
  expiryDays: 30,
};

export const TIER_FEATURES: Record<SubscriptionTier, TierFeatures> = {
  free: {
    tier: 'free',
    monthlyInk: 60,
    rolloverDays: 30,
    models: ['flash'],
    exportsQuality: 'low-res-watermark',
    askTaTTTyCosts: {
      optimize: 3,
      idea: 5,
      brainstorm: 8, // per 10 messages
    },
    askTaTTTyLimits: {
      brainstormMessagesPerDay: 20,
    },
    controlTools: [], // Upload allowed but ControlNet locked
    includedUpscales: 0,
    queuePriority: 'standard',
    license: 'personal',
  },
  creator: {
    tier: 'creator',
    monthlyInk: 400,
    rolloverDays: 60,
    models: ['flash', 'medium', 'large'],
    exportsQuality: 'full-res-no-watermark',
    askTaTTTyCosts: {
      optimize: 'free',
      idea: 1,
      brainstorm: 2, // per 10 messages
    },
    askTaTTTyLimits: {
      brainstormMessagesPerDay: 200,
    },
    controlTools: ['sketch', 'structure'], // Style/Style Transfer available with INK
    includedUpscales: 10,
    queuePriority: 'priority',
    license: 'personal',
  },
  studio: {
    tier: 'studio',
    monthlyInk: 1200,
    rolloverDays: 60,
    models: ['flash', 'medium', 'large', 'turbo'],
    exportsQuality: 'full-res',
    askTaTTTyCosts: {
      optimize: 'free',
      idea: 'free', // up to 50/day then 1 INK
      brainstorm: 'free', // up to 200/day then 1 INK per 10
    },
    askTaTTTyLimits: {
      ideasPerDay: 50,
      brainstormMessagesPerDay: 200,
    },
    controlTools: ['sketch', 'structure', 'style', 'style-transfer'],
    includedUpscales: 40,
    queuePriority: 'top',
    license: 'personal', // Can add Pro Shop for commercial
  },
};

// ============================================================================
// BONUS & RETENTION CONSTANTS
// ============================================================================

export const SIGNUP_BONUS = {
  ink: 100,
  expiryDays: 7,
};

export const DAILY_STREAK = {
  inkPerDay: 5,
  weeklyCapInk: 25,
};

export const SHARE_BONUS = {
  ink: 4,
  maxPerDay: 1,
};

export const REFERRAL_BONUS = {
  ink: 100,
  forBoth: true,
};

// ============================================================================
// REGENERATION DISCOUNTS
// ============================================================================

export const REGENERATE_DISCOUNT = {
  windowMinutes: 15,
  discountPercent: 50,
};

export const RESEED_BUNDLE = {
  count: 3,
  payForCount: 2, // Third is free
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate total INK cost for a generation with controls
 */
export function calculateGenerationCost(
  model: ModelType,
  controls: ControlToolType[] = []
): number {
  let cost = MODEL_CONFIGS[model].baseInkCost;
  
  controls.forEach((control) => {
    cost += CONTROL_TOOL_CONFIGS[control].inkAdder;
  });
  
  return cost;
}

/**
 * Get human-readable INK balance with usage estimate
 */
export function formatInkBalance(ink: number, tier: SubscriptionTier): string {
  const flashCount = Math.floor(ink / MODEL_CONFIGS.flash.baseInkCost);
  const turboCount = Math.floor(ink / MODEL_CONFIGS.turbo.baseInkCost);
  
  if (tier === 'studio') {
    return `${ink} INK — ≈ ${flashCount} Flash or ${turboCount} Turbo left`;
  } else if (tier === 'creator') {
    const largeCount = Math.floor(ink / MODEL_CONFIGS.large.baseInkCost);
    return `${ink} INK — ≈ ${flashCount} Flash or ${largeCount} Large left`;
  } else {
    return `${ink} INK — ≈ ${flashCount} Flash generations left`;
  }
}

/**
 * Check if user can afford an action
 */
export function canAffordAction(
  currentInk: number,
  requiredInk: number
): boolean {
  return currentInk >= requiredInk;
}

/**
 * Get Ask TaTTTy cost based on tier and action
 */
export function getAskTaTTTyCost(
  tier: SubscriptionTier,
  action: AskTaTTTyActionType,
  usageToday?: { ideas?: number; brainstormMessages?: number }
): number | 'free' {
  const costs = TIER_FEATURES[tier].askTaTTTyCosts;
  const limits = TIER_FEATURES[tier].askTaTTTyLimits;
  
  if (action === 'idea' && tier === 'studio') {
    if (usageToday?.ideas && limits.ideasPerDay && usageToday.ideas >= limits.ideasPerDay) {
      return 1;
    }
    return 'free';
  }
  
  if (action === 'brainstorm' && tier === 'studio') {
    if (usageToday?.brainstormMessages && limits.brainstormMessagesPerDay && 
        usageToday.brainstormMessages >= limits.brainstormMessagesPerDay) {
      return 1; // per 10 messages
    }
    return 'free';
  }
  
  return costs[action];
}

/**
 * Check if model is available for tier
 */
export function isModelAvailable(model: ModelType, tier: SubscriptionTier): boolean {
  return MODEL_CONFIGS[model].availableInTiers.includes(tier);
}

/**
 * Get default model for tier (without detail toggle)
 */
export function getDefaultModelForTier(tier: SubscriptionTier): ModelType {
  // Per spec:
  // Free → Flash
  // Creator → Medium for first pass
  // Studio → Large by default
  if (tier === 'studio') return 'large';
  if (tier === 'creator') return 'medium';
  return 'flash';
}

/**
 * Get model for tier with detail level
 */
export function getModelForTierWithDetail(
  tier: SubscriptionTier, 
  detailLevel: 'standard' | 'more-detail' | 'max-detail'
): ModelType {
  // Per spec:
  // Free → Always Flash
  // Creator → Flash (fast preview), Medium (standard), Large (more detail)
  // Studio → Medium (fast), Large (standard), Turbo (max detail)
  
  if (tier === 'free') return 'flash';
  
  if (tier === 'creator') {
    if (detailLevel === 'more-detail') return 'large';
    if (detailLevel === 'standard') return 'medium';
    return 'flash'; // fast preview
  }
  
  if (tier === 'studio') {
    if (detailLevel === 'max-detail') return 'turbo';
    if (detailLevel === 'standard') return 'large';
    return 'medium'; // fast preview
  }
  
  return 'flash';
}
