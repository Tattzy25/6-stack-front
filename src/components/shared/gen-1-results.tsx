import { Droplet } from 'lucide-react';
import { useInk } from '../../contexts/InkContext';
import { ModelType, MODEL_CONFIGS, getDefaultModelForTier } from '../../types/economy';

interface Gen1ResultsProps {
  onClick?: () => void;
  disabled?: boolean;
  isGenerating?: boolean;
  selectedModel?: ModelType | 'auto';
  estimatedTime?: string; // e.g., "6-12s"
}

export function Gen1Results({ 
  onClick, 
  disabled = false,
  isGenerating = false,
  selectedModel = 'auto',
  estimatedTime 
}: Gen1ResultsProps) {
  const { getGenerationCost, tier, balance, canAfford } = useInk();
  
  // Determine effective model for Auto
  const effectiveModel: ModelType = selectedModel === 'auto'
    ? getDefaultModelForTier(tier)
    : selectedModel;
  
  // Calculate INK cost based on selected/effective model
  const inkCost = getGenerationCost(effectiveModel);
  const canUserAfford = canAfford(inkCost);
  const timeStr = estimatedTime ?? `${MODEL_CONFIGS[effectiveModel].estimatedTimeSeconds[0]}-${MODEL_CONFIGS[effectiveModel].estimatedTimeSeconds[1]}s`;
  
  return (
    <>
      <style>{`
        .gen-gradient-button {
          position: relative;
          padding: 26px 42px;
          font-size: 36px;
          font-weight: bold;
          color: white;
          background: transparent;
          border: none;
          cursor: pointer;
          border-radius: 16px;
          overflow: hidden;
          transition: transform 0.2s ease;
        }

        .gen-gradient-button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .gen-gradient-button:not(:disabled):hover {
          transform: scale(1.03);
        }

        .gen-gradient-button::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(
            from 0deg,
            #ff6b6b,
            #4ecdc4,
            #45b7d1,
            #96ceb4,
            #feca57,
            #ff9ff3,
            #ff6b6b
          );
          animation: spin-gradient 6s linear infinite;
        }

        .gen-gradient-button.generating::before {
          animation-duration: 2s;
        }

        .gen-gradient-text {
          position: relative;
          z-index: 10;
          background: linear-gradient(90deg, #fff, #fff 40%, #57f1d6, #fff 60%, #fff);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        @keyframes spin-gradient {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
      <div className="flex flex-col items-center gap-3">
        <button 
          className={`gen-gradient-button text-[32px] ${isGenerating ? 'generating' : ''}`}
          onClick={onClick} 
          disabled={disabled || isGenerating}
        >
          <span className="gen-gradient-text font-[Rock_Salt]">
            {isGenerating ? 'Creating...' : 'TaTTT NoW'}
          </span>
        </button>
        {/* INK cost and time estimate under the button */}
        <div className="flex items-center gap-2 text-white/80 text-sm">
          <Droplet className="w-4 h-4" fill="currentColor" />
          <span>{inkCost} INK</span>
          {timeStr && (
            <span>({timeStr})</span>
          )}
          {!canUserAfford && inkCost > 0 && (
            <span className="ml-2 text-red-400 text-xs">Need {inkCost - balance} more</span>
          )}
        </div>
      </div>
    </>
  );
}
