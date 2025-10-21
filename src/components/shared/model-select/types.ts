import type { ModelType } from '../../../types/economy';

export type ModelOptionId = ModelType | 'auto';

export interface BaseModelOptionProps {
  id: ModelOptionId;
  label: string;
  subtitle?: string;
  badge?: string;
  selected: boolean;
  onSelect: (id: ModelOptionId) => void;
  className?: string;
  // Added for cost and lock state integration
  disabled?: boolean;
  inkCost?: number; // base INK cost for this model
  estimatedSeconds?: [number, number]; // e.g., [2, 6]
  locked?: boolean; // true if not available for current tier
  lockReason?: string; // e.g., "Upgrade to Creator"
}

export interface ModelSelectPanelProps {
  selectedModel: ModelOptionId;
  onSelect: (id: ModelOptionId) => void;
  className?: string;
}