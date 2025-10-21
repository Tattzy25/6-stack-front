import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Heart, 
  RefreshCw, 
  Plus, 
  Zap,
  Smile,
  Moon,
  Waves,
  HeartHandshake,
  Sparkle,
  Flame,
  Minus,
  RefreshIcon,
  Search
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { 
  MoodSelector,
  SkintonePicker,
  type Mood,
} from './generator/sections';
import { moods } from './generator/mood/moodData';
import { GeneratorCarouselPanel } from './generator/GeneratorCarouselPanel';
import { GeneratorSidebar } from './generator/GeneratorSidebar';
import { GeneratorTypeCard } from './generator/GeneratorTypeCard';
import { ResultsCard } from './shared/ResultsCard';
import { Gen1Results } from './shared/gen-1-results';
import { OutputTypeButtons } from './generator/OutputTypeButtons';
import { SourceCard } from './shared/SourceCard';
import { UploadCard } from './UploadCard';
import { FreestyleCard } from './shared/FreestyleCard';
import { AuthModal } from './shared/AuthModal';
import { 
  getFreestyleInput, 
  clearFreestyleInput, 
  base64ToFile,
  saveGeneratorState,
  getGeneratorState,
  clearGeneratorState 
} from '../utils/inputPersistence';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { useGenerator } from '../contexts/GeneratorContext';
import { SelectionChip } from './shared/SelectionChip';
import { ModelSelectPanel } from './shared/model-select';
import type { ModelType } from '../types/economy';
import { env } from '../utils/env';





interface GeneratorPageProps {
  onNavigate: (page: string) => void;
}

export function GeneratorPage({ onNavigate }: GeneratorPageProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const generator = useGenerator();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [story, setStory] = useState('');
  const [style, setStyle] = useState('traditional');
  const [complexity, setComplexity] = useState([50]);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [selectedColorPreference, setSelectedColorPreference] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedPlacement, setSelectedPlacement] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedSkintone, setSelectedSkintone] = useState<number>(50); // Default to middle of range
  const [outputType, setOutputType] = useState<'color' | 'stencil'>('stencil');
  const [selectedGenerator, setSelectedGenerator] = useState<string>('tattty');
  const [freestylePrompt, setFreestylePrompt] = useState('');
  const [freestyleImages, setFreestyleImages] = useState<File[]>([]);
  const [moodSearchQuery, setMoodSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<ModelType | 'auto'>('auto');
  
  // Sync local state with generator context
  useEffect(() => {
    generator.updateGeneratorType(selectedGenerator);
  }, [selectedGenerator]);
  
  useEffect(() => {
    generator.updateStyle(selectedStyle);
  }, [selectedStyle]);
  
  useEffect(() => {
    generator.updatePlacement(selectedPlacement);
  }, [selectedPlacement]);
  
  useEffect(() => {
    generator.updateSize(selectedSize);
  }, [selectedSize]);
  
  useEffect(() => {
    generator.updateColor(selectedColorPreference);
  }, [selectedColorPreference]);
  
  useEffect(() => {
    generator.updateMood(selectedMood);
  }, [selectedMood]);
  
  useEffect(() => {
    generator.updateSkintone(selectedSkintone);
  }, [selectedSkintone]);
  
  useEffect(() => {
    generator.updateOutputType(outputType);
  }, [outputType]);

  // Restore saved generator state on mount (for users redirected from auth)
  useEffect(() => {
    const savedState = getGeneratorState();
    if (savedState && isAuthenticated) {
      // Restore all generator state
      setSelectedGenerator(savedState.selectedGenerator);
      setSelectedStyle(savedState.selectedStyle);
      setSelectedPlacement(savedState.selectedPlacement);
      setSelectedSize(savedState.selectedSize);
      setSelectedColorPreference(savedState.selectedColorPreference);
      setSelectedMood(savedState.selectedMood);
      setSelectedSkintone(savedState.selectedSkintone);
      setOutputType(savedState.outputType);
      setFreestylePrompt(savedState.freestylePrompt);
      
      // Convert base64 images back to File objects
      const restoredFiles = savedState.freestyleImages.map((base64, index) => 
        base64ToFile(base64, `image-${index}.png`)
      );
      setFreestyleImages(restoredFiles);
      
      // Clear saved state after restoring
      clearGeneratorState();
      
      // Auto-generate after restoration
      toast.success('Your design is being generated!', {
        description: 'All your selections have been restored'
      });
      
      // Trigger generation
      setTimeout(() => {
        handleGenerate();
      }, 500);
    }
  }, [isAuthenticated]);

  const handleGenerate = async () => {
    try {
      // Read inputs from current UI state
      const prompt = freestylePrompt.trim();
      if (!prompt) {
        toast.error('Please enter a prompt before generating.');
        return;
      }

      // Map selected model to Stability model value (fallback to medium)
      const modelMap: Record<string, string> = {
        flash: 'sd3.5-flash',
        medium: 'sd3.5-medium',
        large: 'sd3.5-large',
        turbo: 'sd3.5-large-turbo',
        auto: 'sd3.5-medium',
      };
      const modelKey = (selectedModel || 'auto') as string;
      const model = modelMap[modelKey] || modelMap.auto;

      // Start loading
      setGenerating(true);
      setGenerated(false);

      // Prepare request
      const endpoint = `${env.apiBaseUrl}/api/images/generate/sd3`;
      const payload = {
        prompt,
        model,
        aspect_ratio: '16:9',
        output_format: 'png',
        negative_prompt: undefined,
        mode: model === 'sd3.5-large' ? 'text-to-image' : undefined,
        options: {
          style: selectedStyle,
          placement: selectedPlacement,
          size: selectedSize,
          colorPreference: selectedColorPreference,
          mood: selectedMood,
          skintone: selectedSkintone,
          outputType,
        },
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        throw new Error(errText || `HTTP ${res.status}: ${res.statusText}`);
      }

      // Handle both JSON (base64) and binary image responses
      let imageUrl: string | null = null;
      const contentType = res.headers.get('content-type') || '';

      if (contentType.startsWith('image/')) {
        const blob = await res.blob();
        imageUrl = URL.createObjectURL(blob);
      } else {
        const data = await res.json().catch(() => ({} as any));
        const base64 = data.imageBase64 || data.image_base64 || null;
        const format = payload.output_format;
        if (base64) {
          imageUrl = `data:image/${format};base64,${base64}`;
        }
      }

      if (!imageUrl) {
        throw new Error('Backend did not return an image.');
      }

      setResultImageUrl(imageUrl);
      setGenerated(true);
    } catch (error: any) {
      console.error('Generation failed:', error);
      toast.error(error?.message || 'Failed to generate image.');
      setGenerated(false);
    } finally {
      setGenerating(false);
    }
  };

  const styles = [
    'Traditional', 'Neo-Traditional', 'Realism', 'Watercolor', 'Minimalist',
    'Geometric', 'Japanese', 'Tribal', 'Blackwork', 'Dotwork',
  ];

  const placements = [
    'Forearm', 'Upper Arm', 'Shoulder', 'Back', 'Chest',
    'Leg', 'Ankle', 'Wrist', 'Neck', 'Rib',
  ];

  // Moods data now imported from /components/generator/mood/moodData.ts
  
  // Filter moods based on mood search query
  const filteredMoods = moods.filter(mood =>
    mood.label.toLowerCase().includes(moodSearchQuery.toLowerCase())
  );

  const mockGeneratedDesigns = [
    'https://images.unsplash.com/photo-1605647533135-51b5906087d0?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1552627019-947c3789ffb5?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1565058698270-c8e5c574f25e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400&h=400&fit=crop',
  ];


  const getMoodTitle = () => {
    return 'Set Your Mood';
  };

  return (
    <>
      {/* Auth Modal - Only shows when user tries to generate without auth */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      <div className="h-full w-full lg:overflow-hidden overflow-y-auto">
      <div className="lg:h-full grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 md:gap-8 py-20 lg:py-0">
          {/* Left Panel - Independently Scrollable on Desktop, Part of Page Flow on Mobile */}
          <div 
            className="lg:h-full lg:overflow-y-auto space-y-8 md:space-y-10 lg:pt-20 pb-12 px-4 md:px-4 lg:px-2.5"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <style>{`
              .lg\\:h-full::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {/* Generator Type Selector Card */}
            <div className="pt-8 md:pt-12">
              <GeneratorTypeCard 
                selectedGenerator={selectedGenerator}
                onSelectGenerator={setSelectedGenerator}
              />
            </div>

            {/* Brainstorm Card - Show first after generator type selection */}
            {selectedGenerator === 'brainstorm' && (
              <>
                <div className="pt-[100px]">
                  {/* External Title */}
                  <h3 className="text-2xl md:text-3xl font-[Orbitron] text-center text-white mb-6" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)', letterSpacing: '3px' }}>
                    Let's brainstorm
                  </h3>
                  <FreestyleCard 
                    mode="brainstorm"
                    personaId="brainstorm"
                    initialText={freestylePrompt}
                    initialImages={freestyleImages}
                  />
                </div>

                {/* Final Submission Card */}
                <div className="pt-8 md:pt-10">
                  <Card className="relative overflow-hidden border-2 border-accent/20" style={{
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    background: 'linear-gradient(90deg, hsla(0, 0%, 100%, 0.2), hsla(0, 0%, 100%, 0.05))',
                    borderRadius: '70px',
                    boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
                  }}>
                    <CardContent className="p-4 md:p-6 flex flex-col gap-4">
                      <textarea 
                        value={freestylePrompt}
                        onChange={(e) => setFreestylePrompt(e.target.value)}
                        className="w-full px-4 py-3 bg-transparent border border-accent/30 focus:border-accent/50 rounded-2xl text-white placeholder:text-muted-foreground focus:outline-none transition-all resize-y"
                        placeholder="Paste your brainstormed idea here..."
                        style={{ minHeight: '150px' }}
                      />
                      
                      {/* Submit Button */}
                      <div className="flex justify-center">
                        <button
                          onClick={() => {
                            if (freestylePrompt.trim().length === 0) {
                              toast.error('Please paste your idea first!');
                              return;
                            }
                            // Handle submission logic here
                            toast.success('Idea submitted!');
                          }}
                          className="px-8 py-3 bg-gradient-to-r from-accent/80 to-accent text-background font-[Orbitron] rounded-xl transition-all duration-300 flex items-center gap-2 hover:shadow-[0_0_20px_rgba(87,241,214,0.6)] hover:scale-105"
                          style={{
                            boxShadow: '0 0 15px rgba(87, 241, 214, 0.4)',
                            letterSpacing: '2px',
                          }}
                        >
                          <Sparkles size={20} />
                          <span className="font-bold">SUBMIT</span>
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {/* Carousel Panel Section */}
            <div className="pt-4 md:pt-6">
              <GeneratorCarouselPanel
                styles={styles}
                placements={placements}
                selectedStyle={selectedStyle}
                selectedPlacement={selectedPlacement}
                selectedSize={selectedSize}
                selectedColorPreference={selectedColorPreference}
                outputType={outputType}
                onSelectStyle={setSelectedStyle}
                onSelectPlacement={setSelectedPlacement}
                onSelectSize={setSelectedSize}
                onSelectColorPreference={setSelectedColorPreference}
                onOutputTypeChange={setOutputType}
              />
            </div>

            {/* Mood/Theme Search Bar with Selection Chip */}
            <div className="space-y-4 pt-6 md:pt-8">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type="text"
                  placeholder="Search Mood/Theme"
                  value={moodSearchQuery}
                  onChange={(e) => setMoodSearchQuery(e.target.value)}
                  className="pl-10 pr-20 h-16 md:h-20 bg-background/90 border-accent/50 focus-visible:border-accent focus-visible:ring-accent/50 text-base md:!text-xl rounded-lg font-[Orbitron]"
                />
                {moodSearchQuery && (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                    {filteredMoods.length} result{filteredMoods.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              {selectedMood && (
                <div className="flex justify-center">
                  <SelectionChip 
                    label="Mood"
                    value={moods.find(m => m.id === selectedMood)?.label || selectedMood}
                    onClear={() => setSelectedMood(null)}
                  />
                </div>
              )}
            </div>

            {/* Mood Selector */}
            <div className="pt-4 md:pt-6">
              <MoodSelector
                moods={filteredMoods}
                selectedMood={selectedMood}
                onSelectMood={setSelectedMood}
                title={getMoodTitle()}
              />
            </div>

            {/* Skintone Picker */}
            <div className="pt-8 md:pt-12">
              <SkintonePicker
                selectedSkintone={selectedSkintone}
                onSelectSkintone={setSelectedSkintone}
              />
            </div>

            {/* Freestyle Card (shown based on selected generator) */}
            {selectedGenerator === 'freestyle' && (
              <div className="pt-8 md:pt-12">
                <FreestyleCard 
                  title="Freestyle"
                  mode="freestyle"
                  initialText={freestylePrompt}
                  initialImages={freestyleImages}
                />
              </div>
            )}

            {/* Output Type Buttons */}
            <div className="pt-6 md:pt-8">
              <OutputTypeButtons
                outputType={outputType}
                onOutputTypeChange={setOutputType}
              />
            </div>

            {/* Image Upload Card */}
            {selectedGenerator === 'tattty' && (
              <div className="pt-8 md:pt-12">
                <UploadCard />
              </div>
            )}

            {/* Questions Card - SourceCard */}
            {selectedGenerator === 'tattty' && (
              <div className="pt-8 md:pt-12">
                <SourceCard generatorType="freestyle" />
              </div>
            )}

            {/* Model Select Panel */}
            <div className="pt-6 md:pt-8">
              <ModelSelectPanel
                selectedModel={selectedModel}
                onSelect={setSelectedModel}
              />
            </div>

            {/* Generator Page Generate Button */}
            <div className="flex justify-center md:pt-12 pt-[100px] pr-[0px] pb-[0px] pl-[0px] mt-[0px] mr-[0px] mb-[10px] ml-[0px]">
              <Gen1Results 
                onClick={handleGenerate}
                isGenerating={generating}
                selectedModel={selectedModel}
              />
            </div>

            {/* Results Card - Always Visible (with integrated Generate button) */}
            <div style={{ marginTop: '120px' }} className="pb-8 md:pb-12">
              <ResultsCard 
                designs={generated ? [resultImageUrl ?? mockGeneratedDesigns[0]] : []}
                isGenerating={generating}
                aspectRatio="16/9"
                maxWidth="6xl"
                onGenerate={handleGenerate}
                onNavigate={onNavigate}

              />
            </div>

          </div>

          {/* Right Sidebar - Independently Scrollable on Desktop, Part of Page Flow on Mobile */}
          <GeneratorSidebar 
            selectedGenerator={selectedGenerator}
            freestyleInitialText={freestylePrompt}
            freestyleInitialImages={freestyleImages}
          >
          </GeneratorSidebar>
        </div>
      </div>
    </>
  );
}
