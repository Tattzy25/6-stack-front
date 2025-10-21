import React from 'react';
import { cn } from '../../ui/utils';
import { MODEL_OPTION_CONFIGS } from './config';
import type { ModelOptionId, ModelSelectPanelProps } from './types';
import { AutoModelOption } from './Auto';
import { FlashModelOption } from './Flash';
import { MediumModelOption } from './Medium';
import { LargeModelOption } from './Large';
import { TurboModelOption } from './Turbo';
import { useInk } from '../../../contexts/InkContext';
import { useAuth } from '../../../contexts/AuthContext';
import { MODEL_CONFIGS, isModelAvailable, getDefaultModelForTier, type ModelType } from '../../../types/economy';

const renderOption = (
  cfg: { id: ModelOptionId; label: string; subtitle?: string; badge?: string },
  selectedModel: ModelOptionId,
  onSelect: (id: ModelOptionId) => void,
  extraClass?: string,
  tier?: 'free' | 'creator' | 'studio',
  isAuthenticated?: boolean,
) => {
  // Compute cost and lock states
  let inkCost: number | undefined;
  let estimatedSeconds: [number, number] | undefined;
  let locked = false;
  let lockReason: string | undefined;
  let disabled = false;

  if (cfg.id === 'auto') {
    const effectiveModel = tier ? getDefaultModelForTier(tier) : 'flash';
    inkCost = MODEL_CONFIGS[effectiveModel].baseInkCost;
    estimatedSeconds = MODEL_CONFIGS[effectiveModel].estimatedTimeSeconds;
    locked = false;
    disabled = false;
  } else {
    const model = cfg.id as ModelType;
    inkCost = MODEL_CONFIGS[model].baseInkCost;
    estimatedSeconds = MODEL_CONFIGS[model].estimatedTimeSeconds;

    // Do not show lock states or disable for anonymous users — allow exploration
    if (!isAuthenticated) {
      locked = false;
      disabled = false;
      lockReason = undefined;
    } else if (tier) {
      // Authenticated users: respect tier availability
      locked = !isModelAvailable(model, tier);
      disabled = locked;
      if (locked) {
        lockReason = `Upgrade to ${model === 'turbo' ? 'Studio' : 'Creator'}`;
      }
    }
  }

  const commonProps = {
    id: cfg.id,
    label: cfg.label,
    subtitle: cfg.subtitle,
    badge: cfg.badge,
    selected: selectedModel === cfg.id,
    onSelect,
    className: cn('h-14 md:h-16', extraClass),
    disabled,
    inkCost,
    estimatedSeconds,
    locked,
    lockReason,
  };

  switch (cfg.id) {
    case 'auto':
      return <AutoModelOption {...commonProps} />;
    case 'flash':
      return <FlashModelOption {...commonProps} />;
    case 'medium':
      return <MediumModelOption {...commonProps} />;
    case 'large':
      return <LargeModelOption {...commonProps} />;
    case 'turbo':
      return <TurboModelOption {...commonProps} />;
    default:
      return null;
  }
};

export function ModelSelectPanel({ selectedModel, onSelect, className }: ModelSelectPanelProps) {
  const { tier } = useInk();
  const { isAuthenticated } = useAuth();
  const autoCfg = MODEL_OPTION_CONFIGS.find((c) => c.id === 'auto');
  const otherCfgs = MODEL_OPTION_CONFIGS.filter((c) => c.id !== 'auto');

  return (
    <div className={cn('mx-auto w-full max-w-4xl space-y-2', className)}>
      {/* Top row: Auto, centered, single line */}
      <div className="flex w-full items-center justify-center">
        {autoCfg && renderOption(autoCfg, selectedModel, onSelect, 'w-full sm:w-3/4 justify-center text-center', tier, isAuthenticated)}
      </div>

      {/* Second row: four options, compact widths to remove dead space */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {otherCfgs.map((cfg) => (
          <div key={cfg.id} className="w-full">
            {renderOption(cfg, selectedModel, onSelect, 'w-full', tier, isAuthenticated)}
          </div>
        ))}
      </div>
    </div>
  );
}