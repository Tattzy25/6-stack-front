import { Droplet } from 'lucide-react';
import { useInk } from '../../contexts/InkContext';
import { ModelType } from '../../types/economy';

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
  const { getGenerationCost, canAfford, tier } = useInk();
  
  // Calculate INK cost based on selected model
  const inkCost = selectedModel === 'auto' 
    ? getGenerationCost(tier === 'free' ? 'flash' : tier === 'creator' ? 'medium' : 'large')
    : getGenerationCost(selectedModel);
  
  const canUserAfford = canAfford(inkCost);
  
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
          z-index: -2;
          filter: blur(10px);
          transform: rotate(0deg);
          transition: transform 1.5s ease-in-out;
        }

        .gen-gradient-button:not(:disabled):hover::before {
          transform: rotate(180deg);
        }

        .gen-gradient-button.generating::before {
          animation: spin-gradient 3s linear infinite;
        }

        .gen-gradient-button::after {
          content: "";
          position: absolute;
          inset: 3px;
          background: black;
          border-radius: 47px;
          z-index: -1;
          filter: blur(5px);
        }

        .gen-gradient-text {
          color: transparent;
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
          background-clip: text;
          -webkit-background-clip: text;
          filter: hue-rotate(0deg);
        }

        .gen-gradient-button:not(:disabled):hover .gen-gradient-text {
          animation: hue-rotating 2s linear infinite;
        }

        .gen-gradient-button.generating .gen-gradient-text {
          animation: hue-rotating 1s linear infinite;
        }

        .gen-gradient-button:active:not(:disabled) {
          transform: scale(0.99);
        }

        @keyframes hue-rotating {
          to {
            filter: hue-rotate(360deg);
          }
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
          disabled={disabled || isGenerating || !canUserAfford}
        >
          <span className="gen-gradient-text font-[Rock_Salt]">
            {isGenerating ? 'Creating...' : 'TaTTT NoW'}
          </span>
        </button>
      </div>
    </>
  );
}
