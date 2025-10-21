import type { ModelOptionId } from './types';

export interface ModelOptionConfig {
  id: ModelOptionId;
  label: string;
  subtitle?: string;
  badge?: string;
}

export const MODEL_OPTION_CONFIGS: ModelOptionConfig[] = [
  {
    id: 'auto',
    label: 'Auto (Recommended) — chooses best model',
  },
  {
    id: 'flash',
    label: 'Flash - Fast Draft',
  },
  {
    id: 'medium',
    label: 'Medium - Balanced',
  },
  {
    id: 'large',
    label: 'Large - Detailed',
    badge: 'Popular',
  },
  {
    id: 'turbo',
    label: 'Turbo - MaXX Detailed',
  },
];