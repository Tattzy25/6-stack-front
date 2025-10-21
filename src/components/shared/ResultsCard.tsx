import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Download, Heart, Share2, Bookmark, Users, Sparkles, Wand2, Image as ImageIcon, Shuffle, Edit3, Droplet } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { toast } from 'sonner';
import { HalftoneLoader } from '../generator/HalftoneLoader';
import { useInk } from '../../contexts/InkContext';
import { EDIT_ACTION_CONFIGS, getDefaultModelForTier } from '../../types/economy';

interface ResultsCardProps {
  // Core functionality
  designs?: string[];
  isGenerating?: boolean;
  
  // Customization options
  aspectRatio?: '16/9' | '4/3' | '1/1' | 'square';
  maxWidth?: string;
  showTitle?: boolean;
  title?: string;
  className?: string;
  
  // Icon controls
  showIcons?: boolean;
  iconSize?: number;
  
  // Custom handlers (optional overrides)
  onDownload?: () => void;
  onSaveToFavorites?: () => void;
  onShareToCommunity?: () => void;
  onShareSocial?: () => void;
  onSaveToDashboard?: () => void;
  onGenerate?: () => void;
  onNavigate?: (page: string) => void;
  
  // Post-generation editing options
  showEditOptions?: boolean;
  onRelight?: () => void;
  onErase?: () => void;
  onInpaint?: () => void;
  onOutpaint?: () => void;
  onVariations?: () => void;
  onOpenEditor?: () => void;
}

export function ResultsCard({ 
  designs = [], 
  isGenerating = false,
  aspectRatio = '16/9',
  maxWidth = 'full',
  showTitle = true,
  title = 'Results card',
  className = '',
  showIcons = true,
  iconSize = 28,
  onDownload,
  onSaveToFavorites,
  onShareToCommunity,
  onShareSocial,
  onSaveToDashboard,
  onGenerate,
  onNavigate,
  showEditOptions = true,
  onRelight,
  onErase,
  onInpaint,
  onOutpaint,
  onVariations,
  onOpenEditor,
}: ResultsCardProps) {
  const [activeTab, setActiveTab] = useState<'adjust' | 'retouch' | 'background' | 'variations' | null>(null);
  const hasGenerated = designs.length > 0 && !isGenerating;
  const generatedImage = designs[0]; // Only use the first image

  // INK costs and time estimates for edit actions
  const { getEditCost, getGenerationCost, tier } = useInk();
  const eraseCost = getEditCost('erase');
  const inpaintCost = getEditCost('inpaint');
  const outpaintCost = getEditCost('outpaint');
  const defaultModel = getDefaultModelForTier(tier);
  const variationsCost = getGenerationCost(defaultModel) * 3;
  const eraseTime = `${EDIT_ACTION_CONFIGS.erase.estimatedTimeSeconds[0]}-${EDIT_ACTION_CONFIGS.erase.estimatedTimeSeconds[1]}s`;
  const inpaintTime = `${EDIT_ACTION_CONFIGS.inpaint.estimatedTimeSeconds[0]}-${EDIT_ACTION_CONFIGS.inpaint.estimatedTimeSeconds[1]}s`;
  const outpaintTime = `${EDIT_ACTION_CONFIGS.outpaint.estimatedTimeSeconds[0]}-${EDIT_ACTION_CONFIGS.outpaint.estimatedTimeSeconds[1]}s`;

  // Map aspect ratio to Tailwind class
  const aspectRatioMap = {
    '16/9': 'aspect-[16/9]',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
    'square': 'aspect-square',
  };

  const aspectClass = aspectRatioMap[aspectRatio];
  const maxWidthClass = `max-w-${maxWidth}`;

  // Default handlers
  const handleDownload = onDownload || (() => {
    toast.success('Downloading tattoo design...');
  });

  const handleSaveToFavorites = onSaveToFavorites || (() => {
    toast.success('Saved to your favorites!');
  });

  const handleShareToCommunity = onShareToCommunity || (() => {
    toast.success('Shared to TaTTTy community!');
  });

  const handleShareSocial = onShareSocial || (async () => {
    // Use native Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My TaTTTy Design',
          text: 'Check out my custom tattoo design created with TaTTTy!',
          url: window.location.href,
        });
        toast.success('Shared successfully!');
      } catch (err) {
        // User cancelled or share failed
        if ((err as Error).name !== 'AbortError') {
          toast.error('Share failed. Please try again.');
        }
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      toast.info('Share feature not available on this browser');
    }
  });

  const handleSaveToDashboard = onSaveToDashboard || (() => {
    toast.success('Saved to your dashboard!');
  });

  return (
    <Card className={`relative overflow-hidden border-2 border-accent/20 ${className}`} style={{
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      background: 'linear-gradient(90deg, hsla(0, 0%, 100%, 0.2), hsla(0, 0%, 100%, 0.05))',
      borderRadius: '70px',
      minHeight: '600px',
      boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
    }}>
      <CardContent className="md:p-6 space-y-4 px-[24px] py-[10px] p-[24px]">
        {/* Icon Actions - Only show when image is generated */}
        {showIcons && hasGenerated && (
          <TooltipProvider>
            <div className="flex items-center justify-center gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleDownload}
                    className="p-3 hover:text-accent transition-colors"
                    aria-label="Download"
                  >
                    <Download size={iconSize} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Download</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleSaveToFavorites}
                    className="p-3 hover:text-accent transition-colors"
                    aria-label="Save to Favorites"
                  >
                    <Bookmark size={iconSize} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Save to Favorites</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleShareToCommunity}
                    className="p-3 hover:text-accent transition-colors"
                    aria-label="Share to Community"
                  >
                    <Users size={iconSize} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Share to Community</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleShareSocial}
                    className="p-3 hover:text-accent transition-colors"
                    aria-label="Share on Social Media"
                  >
                    <Share2 size={iconSize} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Share on Social Media</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleSaveToDashboard}
                    className="p-3 hover:text-accent transition-colors text-center"
                    aria-label="Save to Dashboard"
                  >
                    <Heart size={iconSize} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Save to Dashboard</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        )}



        {/* Loading State - Halftone Animation */}
        {isGenerating ? (
          <div className={`w-full ${aspectClass} ${maxWidthClass} mx-auto rounded-3xl overflow-hidden border-2 border-accent/20 relative`}>
            <HalftoneLoader 
              direction="bottom"
              spacing={20}
              duration={1.7}
              stagger={0.05}
            />
          </div>
        ) : hasGenerated ? (
          /* Single Large Generated Image */
          <>
            <div className={`w-full ${aspectClass} ${maxWidthClass} mx-auto rounded-3xl overflow-hidden border-2 border-accent hover:border-accent/80 transition-all cursor-pointer`}>
              <ImageWithFallback
                src={generatedImage}
                alt="Generated tattoo design"
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Post-Generation Edit Options */}
            {showEditOptions && (
              <div className="space-y-4 mt-6">
                {/* Action Chips (no tabs) */}
                <div className="flex flex-wrap items-center justify-center gap-2 px-[0px] py-[20px]">
                  <button
                    onClick={() => { setActiveTab('retouch'); onErase?.(); toast.success('Opening erase tool...'); }}
                    className="px-3 py-2 rounded-lg bg-[#57f1d6]/10 border border-[#57f1d6]/30 text-white hover:bg-[#57f1d6]/20 transition-all flex items-center gap-2"
                  >
                    <Wand2 size={14} />
                    <span>Erase</span>
                    <span className="flex items-center gap-1 text-xs text-[#57f1d6]">
                      <Droplet size={12} fill="#57f1d6" />
                      {eraseCost}
                    </span>
                    <span className="text-xs text-white/60">({eraseTime})</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('retouch'); onInpaint?.(); toast.success('Opening inpaint tool...'); }}
                    className="px-3 py-2 rounded-lg bg-[#57f1d6]/10 border border-[#57f1d6]/30 text-white hover:bg-[#57f1d6]/20 transition-all flex items-center gap-2"
                  >
                    <Wand2 size={14} />
                    <span>Inpaint</span>
                    <span className="flex items-center gap-1 text-xs text-[#57f1d6]">
                      <Droplet size={12} fill="#57f1d6" />
                      {inpaintCost}
                    </span>
                    <span className="text-xs text-white/60">({inpaintTime})</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('retouch'); onOutpaint?.(); toast.success('Opening outpaint tool...'); }}
                    className="px-3 py-2 rounded-lg bg-[#57f1d6]/10 border border-[#57f1d6]/30 text-white hover:bg-[#57f1d6]/20 transition-all flex items-center gap-2"
                  >
                    <Wand2 size={14} />
                    <span>Outpaint</span>
                    <span className="flex items-center gap-1 text-xs text-[#57f1d6]">
                      <Droplet size={12} fill="#57f1d6" />
                      {outpaintCost}
                    </span>
                    <span className="text-xs text-white/60">({outpaintTime})</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('variations'); onVariations?.(); toast.success('Generating 3 variations...'); }}
                    className="px-3 py-2 rounded-lg bg-[#57f1d6]/10 border border-[#57f1d6]/30 text-white hover:bg-[#57f1d6]/20 transition-all flex items-center gap-2"
                  >
                    <Shuffle size={14} />
                    <span>3x Variations</span>
                    <span className="flex items-center gap-1 text-xs text-[#57f1d6]">
                      <Droplet size={12} fill="#57f1d6" />
                      {variationsCost}
                    </span>
                  </button>
                </div>

                {/* Expanded Options based on Active Tab */}


                {activeTab === 'retouch' && (
                  <div className="p-4 rounded-2xl bg-white/5 border border-[#57f1d6]/20 backdrop-blur-sm space-y-3">
                    <h4 className="text-sm text-white/80 mb-2">Retouch Options</h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          onErase?.();
                          toast.success('Opening erase tool...');
                        }}
                        className="px-3 py-2 rounded-lg bg-[#57f1d6]/10 border border-[#57f1d6]/30 text-white hover:bg-[#57f1d6]/20 transition-all flex items-center gap-2"
                      >
                        <Wand2 size={14} />
                        <span>Erase</span>
                        <span className="flex items-center gap-1 text-xs text-[#57f1d6]">
                          <Droplet size={12} fill="#57f1d6" />
                          {eraseCost}
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          onInpaint?.();
                          toast.success('Opening inpaint tool...');
                        }}
                        className="px-3 py-2 rounded-lg bg-[#57f1d6]/10 border border-[#57f1d6]/30 text-white hover:bg-[#57f1d6]/20 transition-all flex items-center gap-2"
                      >
                        <Wand2 size={14} />
                        <span>Inpaint</span>
                        <span className="flex items-center gap-1 text-xs text-[#57f1d6]">
                          <Droplet size={12} fill="#57f1d6" />
                          {inpaintCost}
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          onOutpaint?.();
                          toast.success('Opening outpaint tool...');
                        }}
                        className="px-3 py-2 rounded-lg bg-[#57f1d6]/10 border border-[#57f1d6]/30 text-white hover:bg-[#57f1d6]/20 transition-all flex items-center gap-2"
                      >
                        <Wand2 size={14} />
                        <span>Outpaint</span>
                        <span className="flex items-center gap-1 text-xs text-[#57f1d6]">
                          <Droplet size={12} fill="#57f1d6" />
                          {outpaintCost}
                        </span>
                      </button>
                    </div>
                  </div>
                )}



                {activeTab === 'variations' && (
                  <div className="p-4 rounded-2xl bg-white/5 border border-[#57f1d6]/20 backdrop-blur-sm space-y-3">
                    <h4 className="text-sm text-white/80 mb-2">Generate Variations</h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          onVariations?.();
                          toast.success('Generating 3 variations...');
                        }}
                        className="px-3 py-2 rounded-lg bg-[#57f1d6]/10 border border-[#57f1d6]/30 text-white hover:bg-[#57f1d6]/20 transition-all flex items-center gap-2"
                      >
                        <Shuffle size={14} />
                        <span>3x Variations Bundle</span>
                        <span className="flex items-center gap-1 text-xs text-[#57f1d6]">
                          <Droplet size={12} fill="#57f1d6" />
                          {variationsCost}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className={`w-full ${aspectClass} ${maxWidthClass} mx-auto rounded-3xl overflow-hidden border-2 border-border/30 bg-muted/20 relative flex items-center justify-center`}>
          </div>
        )}


      </CardContent>
    </Card>
  );
}
