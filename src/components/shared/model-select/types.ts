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
  // Added for cost integration
  inkCost?: number; // base INK cost for this model
  estimatedSeconds?: [number, number]; // e.g., [2, 6]
  layout?: 'square' | 'wide'
}

export interface ModelSelectPanelProps {
  selectedModel: ModelOptionId;
  onSelect: (id: ModelOptionId) => void;
  className?: string;
}