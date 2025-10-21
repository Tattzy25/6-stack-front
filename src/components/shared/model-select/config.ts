import type { ModelOptionId } from './types';

export interface ModelOptionConfig {
  id: ModelOptionId;
  label: string; // top name
  subtitle?: string; // bottom descriptor
  badge?: string; // e.g., Recommended, Popular
}

export const MODEL_OPTION_CONFIGS: ModelOptionConfig[] = [
  {
    id: 'auto',
    label: 'Auto',
    subtitle: 'Let me decide',
    badge: 'Recommended',
  },
  {
    id: 'flash',
    label: 'Flash',
    subtitle: 'Fast draft',
  },
  {
    id: 'medium',
    label: 'Medium',
    subtitle: 'Balanced',
  },
  {
    id: 'large',
    label: 'Large',
    subtitle: 'Detailed',
  },
  {
    id: 'turbo',
    label: 'Turbo',
    subtitle: 'Max details',
  },
];