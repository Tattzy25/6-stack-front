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
import { toast } from 'sonner@2.0.3';
import { HalftoneLoader } from '../generator/HalftoneLoader';

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
  onUpscale?: (scale: '2x' | '4x') => void;
  onRelight?: () => void;
  onErase?: () => void;
  onInpaint?: () => void;
  onOutpaint?: () => void;
  onRemoveBackground?: () => void;
  onReplaceBackground?: () => void;
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
  onUpscale,
  onRelight,
  onErase,
  onInpaint,
  onOutpaint,
  onRemoveBackground,
  onReplaceBackground,
  onVariations,
  onOpenEditor,
}: ResultsCardProps) {
  const [activeTab, setActiveTab] = useState<'adjust' | 'retouch' | 'background' | 'variations' | null>(null);
  const hasGenerated = designs.length > 0 && !isGenerating;
  const generatedImage = designs[0]; // Only use the first image

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
                {/* Main Action Chips */}
                <div className="flex flex-wrap items-center justify-center gap-2 px-[0px] py-[20px]">
                  {/* Adjust Button */}
                  <button
                    onClick={() => setActiveTab(activeTab === 'adjust' ? null : 'adjust')}
                    className={`px-4 py-2 rounded-full border-2 transition-all flex items-center gap-2 ${
                      activeTab === 'adjust'
                        ? 'bg-[#57f1d6] border-[#57f1d6] text-[#0C0C0D]'
                        : 'bg-transparent border-[#57f1d6]/30 text-white hover:border-[#57f1d6]/60'
                    }`}
                  >
                    <Sparkles size={16} />
                    <span className="text-[20px] font-[Orbitron]">Adjust</span>
                  </button>

                  {/* Retouch Button */}
                  <button
                    onClick={() => setActiveTab(activeTab === 'retouch' ? null : 'retouch')}
                    className={`px-4 py-2 rounded-full border-2 transition-all flex items-center gap-2 ${
                      activeTab === 'retouch'
                        ? 'bg-[#57f1d6] border-[#57f1d6] text-[#0C0C0D]'
                        : 'bg-transparent border-[#57f1d6]/30 text-white hover:border-[#57f1d6]/60'
                    }`}
                  >
                    <Wand2 size={16} />
                    <span className="text-[20px] font-[Orbitron]">Retouch</span>
                  </button>

                  {/* Background Button */}
                  <button
                    onClick={() => setActiveTab(activeTab === 'background' ? null : 'background')}
                    className={`px-4 py-2 rounded-full border-2 transition-all flex items-center gap-2 ${
                      activeTab === 'background'
                        ? 'bg-[#57f1d6] border-[#57f1d6] text-[#0C0C0D]'
                        : 'bg-transparent border-[#57f1d6]/30 text-white hover:border-[#57f1d6]/60'
                    }`}
                  >
                    <ImageIcon size={16} />
                    <span className="text-[20px] font-[Orbitron]">Background</span>
                  </button>

                  {/* Variations Button */}
                  <button
                    onClick={() => setActiveTab(activeTab === 'variations' ? null : 'variations')}
                    className={`px-4 py-2 rounded-full border-2 transition-all flex items-center gap-2 ${
                      activeTab === 'variations'
                        ? 'bg-[#57f1d6] border-[#57f1d6] text-[#0C0C0D]'
                        : 'bg-transparent border-[#57f1d6]/30 text-white hover:border-[#57f1d6]/60'
                    }`}
                  >
                    <Shuffle size={16} />
                    <span className="text-[20px] font-[Orbitron]">Variations</span>
                  </button>

                  {/* Open in Editor Button */}
                  <button
                    onClick={() => {
                      onOpenEditor?.();
                      toast.success('Opening in full editor...');
                    }}
                    className="px-4 py-2 rounded-full border-2 bg-transparent border-accent/30 text-white hover:border-accent/60 transition-all flex items-center gap-2"
                  >
                    <Edit3 size={16} />
                    <span className="text-[20px] font-[Orbitron]">Open in Editor</span>
                  </button>
                </div>

                {/* Expanded Options based on Active Tab */}
                {activeTab === 'adjust' && (
                  <div className="p-4 rounded-2xl bg-white/5 border border-[#57f1d6]/20 backdrop-blur-sm space-y-3">
                    <div className="flex flex-wrap gap-2 px-[0px] py-[20px] justify-center">
                      <button
                        onClick={() => {
                          onUpscale?.('2x');
                          toast.success('Upscaling to 2x...');
                        }}
                        className="px-3 py-2 rounded-lg bg-[#57f1d6]/10 border border-[#57f1d6]/30 text-white hover:bg-[#57f1d6]/20 transition-all flex items-center gap-2"
                      >
                        <Sparkles size={14} />
                        <span style={{ fontSize: '20px' }}>Upscale 2x</span>
                        <span className="flex items-center gap-1 text-xs text-[#57f1d6]">
                          <Droplet size={12} fill="#57f1d6" />
                          10
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          onUpscale?.('4x');
                          toast.success('Upscaling to 4x...');
                        }}
                        className="px-3 py-2 rounded-lg bg-[#57f1d6]/10 border border-[#57f1d6]/30 text-white hover:bg-[#57f1d6]/20 transition-all flex items-center gap-2"
                      >
                        <Sparkles size={14} />
                        <span style={{ fontSize: '20px' }}>Upscale 4x</span>
                        <span className="flex items-center gap-1 text-xs text-[#57f1d6]">
                          <Droplet size={12} fill="#57f1d6" />
                          20
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          onRelight?.();
                          toast.success('Relighting image...');
                        }}
                        className="px-3 py-2 rounded-lg bg-[#57f1d6]/10 border border-[#57f1d6]/30 text-white hover:bg-[#57f1d6]/20 transition-all flex items-center gap-2"
                      >
                        <Sparkles size={14} />
                        <span style={{ fontSize: '20px' }}>Relight</span>
                        <span className="flex items-center gap-1 text-xs text-[#57f1d6]">
                          <Droplet size={12} fill="#57f1d6" />
                          8
                        </span>
                      </button>
                    </div>
                  </div>
                )}

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
                          5
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
                          12
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
                          15
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'background' && (
                  <div className="p-4 rounded-2xl bg-white/5 border border-[#57f1d6]/20 backdrop-blur-sm space-y-3">
                    <h4 className="text-sm text-white/80 mb-2">Background Options</h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          onRemoveBackground?.();
                          toast.success('Removing background...');
                        }}
                        className="px-3 py-2 rounded-lg bg-[#57f1d6]/10 border border-[#57f1d6]/30 text-white hover:bg-[#57f1d6]/20 transition-all flex items-center gap-2"
                      >
                        <ImageIcon size={14} />
                        <span>Remove BG</span>
                        <span className="flex items-center gap-1 text-xs text-[#57f1d6]">
                          <Droplet size={12} fill="#57f1d6" />
                          6
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          onReplaceBackground?.();
                          toast.success('Opening background replacer...');
                        }}
                        className="px-3 py-2 rounded-lg bg-[#57f1d6]/10 border border-[#57f1d6]/30 text-white hover:bg-[#57f1d6]/20 transition-all flex items-center gap-2"
                      >
                        <ImageIcon size={14} />
                        <span>Replace BG</span>
                        <span className="flex items-center gap-1 text-xs text-[#57f1d6]">
                          <Droplet size={12} fill="#57f1d6" />
                          8
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
                          18
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
