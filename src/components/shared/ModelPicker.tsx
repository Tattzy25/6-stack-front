import { useState } from 'react';
import { Lock, Zap, Info } from 'lucide-react';
import { useInk } from '../../contexts/InkContext';
import { useAuth } from '../../contexts/AuthContext';
import { useModal } from '../../contexts/ModalContext';
import {
  ModelType,
  MODEL_CONFIGS,
  isModelAvailable,
  getDefaultModelForTier,
  getModelForTierWithDetail,
} from '../../types/economy';
import { cn } from '../ui/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

type DetailLevel = 'standard' | 'more-detail' | 'max-detail';

interface ModelPickerProps {
  selectedModel: ModelType | 'auto';
  onModelChange: (model: ModelType | 'auto') => void;
  detailLevel?: DetailLevel;
  onDetailLevelChange?: (level: DetailLevel) => void;
  className?: string;
}

export function ModelPicker({ 
  selectedModel, 
  onModelChange, 
  detailLevel = 'standard',
  onDetailLevelChange,
  className 
}: ModelPickerProps) {
  const { tier } = useInk();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { openAuthModal, openUnlockModelModal, openLowBalanceModal } = useModal();
  const [showManual, setShowManual] = useState(selectedModel !== 'auto');
  
  const defaultModel = selectedModel === 'auto' 
    ? getModelForTierWithDetail(tier, detailLevel)
    : selectedModel;
  const effectiveModel = defaultModel;
  
  const handleToggleManual = () => {
    if (showManual) {
      // Switching back to Auto
      onModelChange('auto');
      setShowManual(false);
    } else {
      // Switching to Manual - use current effective model
      onModelChange(effectiveModel);
      setShowManual(true);
    }
  };

  const handleLockedSelection = (model: ModelType) => {
    if (isAuthLoading) {
      return;
    }

    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    const targetTier = model === 'turbo' ? 'studio' : 'creator';
    const label = MODEL_CONFIGS[model].name;

    openUnlockModelModal({
      modelId: model,
      modelLabel: label,
      targetTier,
      onBoost: () => {
        console.log('Boost access for', model);
        onModelChange(model);
      },
      onSubscribe: (tierChoice) => {
        openLowBalanceModal({
          requiredCredits: tierChoice === 'studio' ? 1200 : 400,
          title: `Upgrade to ${tierChoice === 'studio' ? 'Studio' : 'Creator'}`,
          description: 'Plans keep premium detail unlocked every day.',
        });
      },
    });
  };
  
  return (
    <div className={cn('space-y-3', className)}>
      {/* Auto/Manual Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm text-white/80">Model Quality</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-3.5 h-3.5 text-white/40 hover:text-white/60 transition-colors" />
              </TooltipTrigger>
              <TooltipContent 
                side="right"
                className="bg-[#0C0C0D]/95 backdrop-blur-xl border border-[#57f1d6]/20 p-3 max-w-xs"
              >
                <p className="text-xs text-white/80">
                  Auto chooses the best model for your tier so you get speed when exploring 
                  and detail when finalizing.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <button
          onClick={handleToggleManual}
          className="text-xs text-[#57f1d6] hover:text-[#57f1d6]/80 transition-colors"
        >
          {showManual ? 'Switch to Auto' : 'Manual control'}
        </button>
      </div>
      
      {/* Auto Mode */}
      {!showManual && (
        <div className="space-y-3">
          <div className="relative">
            <button
              onClick={() => {/* Auto is already selected */}}
              className={cn(
                'w-full p-4 rounded-lg border backdrop-blur-sm',
                'bg-[#57f1d6]/10 border-[#57f1d6]/30',
                'transition-all duration-200'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-[#57f1d6]" fill="#57f1d6" />
                  <div className="text-left">
                    <p className="text-white font-medium">Auto (Recommended)</p>
                    <p className="text-xs text-white/60 mt-0.5">
                      Picks the best model for your tier and detail
                    </p>
                  </div>
                </div>
              </div>
            </button>
          </div>
          
          {/* Detail Level Toggle - Only for Creator/Studio */}
          {tier !== 'free' && onDetailLevelChange && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
              <span className="text-xs text-white/60 flex-shrink-0">Detail:</span>
              <div className="flex-1 flex gap-2">
                {tier === 'creator' && (
                  <>
                    <DetailButton
                      label="Fast"
                      active={detailLevel === 'standard'}
                      onClick={() => onDetailLevelChange('standard')}
                      model="Flash"
                    />
                    <DetailButton
                      label="More"
                      active={detailLevel === 'more-detail'}
                      onClick={() => onDetailLevelChange('more-detail')}
                      model="Large"
                    />
                  </>
                )}
                {tier === 'studio' && (
                  <>
                    <DetailButton
                      label="Standard"
                      active={detailLevel === 'standard'}
                      onClick={() => onDetailLevelChange('standard')}
                      model="Large"
                    />
                    <DetailButton
                      label="Max"
                      active={detailLevel === 'max-detail'}
                      onClick={() => onDetailLevelChange('max-detail')}
                      model="Turbo"
                    />
                  </>
                )}
              </div>
              <span className="text-xs text-white/40 flex-shrink-0">
                {MODEL_CONFIGS[effectiveModel].name}
              </span>
            </div>
          )}
        </div>
      )}
      
      {/* Manual Mode - Model Grid */}
      {showManual && (
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(MODEL_CONFIGS) as ModelType[]).map((model) => {
            const config = MODEL_CONFIGS[model];
            const isAvailable = isModelAvailable(model, tier);
            const isSelected = selectedModel === model;
            
            return (
              <ModelCard
                key={model}
                model={model}
                config={config}
                isAvailable={isAvailable}
                isSelected={isSelected}
                tier={tier}
                onSelect={() => onModelChange(model)}
                onUnlock={() => handleLockedSelection(model)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MODEL CARD COMPONENT
// ============================================================================

interface ModelCardProps {
  model: ModelType;
  config: typeof MODEL_CONFIGS[ModelType];
  isAvailable: boolean;
  isSelected: boolean;
  tier: string;
  onSelect: () => void;
  onUnlock?: () => void;
}

function ModelCard({ model, config, isAvailable, isSelected, tier, onSelect, onUnlock }: ModelCardProps) {
  const getUpgradeTier = (): string => {
    if (model === 'turbo') return 'Studio';
    if (model === 'medium' || model === 'large') return 'Creator';
    return '';
  };
  
  const handleClick = () => {
    if (isAvailable) {
      onSelect();
    } else {
      onUnlock?.();
    }
  };

  const card = (
    <button
      onClick={handleClick}
      className={cn(
        'relative p-4 rounded-lg border backdrop-blur-sm cursor-pointer',
        'transition-all duration-200',
        'text-left',
        isSelected && 'ring-2 ring-[#57f1d6] ring-offset-2 ring-offset-[#0C0C0D]',
        isAvailable
          ? isSelected
            ? 'bg-[#57f1d6]/10 border-[#57f1d6]/30'
            : 'bg-white/5 border-white/10 hover:border-[#57f1d6]/20 hover:bg-white/10'
          : 'bg-white/5 border-white/10 opacity-80 hover:opacity-100'
      )}
    >
      {/* Lock Icon */}
      {!isAvailable && (
        <div className="absolute top-2 right-2">
          <Lock className="w-4 h-4 text-white/40" />
        </div>
      )}
      
      <div className="space-y-2">
        {/* Model Name */}
        <div className="flex items-center justify-between">
          <h4 className={cn(
            'font-medium',
            isSelected ? 'text-[#57f1d6]' : 'text-white'
          )}>
            {config.name}
          </h4>
        </div>
        
        {/* Description */}
        <p className="text-xs text-white/60">{config.description}</p>
        
        {/* Credits Cost */}
        <div className="flex items-center justify-between pt-1">
          <span className={cn(
            'text-sm font-mono',
            isSelected ? 'text-[#57f1d6]' : 'text-white/80'
          )}>
            {config.baseInkCost} credits
          </span>
          
          {/* Time Estimate */}
          <span className="text-xs text-white/40">
            {config.estimatedTimeSeconds[0]}-{config.estimatedTimeSeconds[1]}s
          </span>
        </div>
        
        {/* Upgrade Prompt for Locked Models */}
        {!isAvailable && (
          <>
            <p className="text-xs text-white/50 pt-1 border-t border-white/10">
              Unlock with {getUpgradeTier()}
            </p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#57f1d6]/80">
              Tap to see options
            </p>
          </>
        )}
      </div>
    </button>
  );
  
  // Wrap with tooltip for locked models
  if (!isAvailable) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {card}
          </TooltipTrigger>
          <TooltipContent 
            side="top"
            className="bg-[#0C0C0D]/95 backdrop-blur-xl border border-[#57f1d6]/20 p-3"
          >
            <p className="text-xs text-white/80">
              Unlock {config.name} with {getUpgradeTier()} — ${getUpgradeTier() === 'Studio' ? '29' : '12'}/mo includes
              {' '}{getUpgradeTier() === 'Studio' ? '1200' : '400'} credits monthly.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return card;
}

// ============================================================================
// DETAIL BUTTON COMPONENT
// ============================================================================

interface DetailButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
  model: string;
}

function DetailButton({ label, active, onClick, model }: DetailButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className={cn(
              'flex-1 px-3 py-1.5 rounded text-xs transition-all',
              active
                ? 'bg-[#57f1d6] text-[#0C0C0D] font-medium'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            )}
          >
            {label}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-[#0C0C0D]/95 backdrop-blur-xl border border-[#57f1d6]/20 p-2">
          <p className="text-xs text-white/80">Uses {model} model</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
