import { useState, useEffect, useRef } from 'react';
import { Sparkles, Palette } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { FrostCardGrid } from './FrostCard';
import { ModernImageCard } from './ModernImageCard';
import { TimelineCard } from './TimelineCard';
import { YourStory } from './YourStory';
import { YourPain } from './YourPain';
import { YourPower } from './YourPower';
import { IntoInk } from './IntoInk';
import { BlackButton } from './shared/BlackButton';
import { ColorButton } from './shared/ColorButton';
import { FreestyleCard } from './shared/FreestyleCard';
import { DemoResultsCard } from './shared/DemoResultsCard';
import { TestimonialCard } from './shared/TestimonialCard';
import { TattooImageCard } from './shared/TattooImageCard';
import { Gen2Land } from './shared/gen-2-land';
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel';
// import { getRandomTattooImages } from '../imageUrls/tattooImages'; // REMOVED - using database now
import { useAuth } from '../contexts/AuthContext';
import { saveFreestyleInput, setAuthRedirect } from '../utils/inputPersistence';
import { toast } from 'sonner';
import { showAuthPromptToast } from './shared/AuthPromptToast';
// Replace figma asset import with URL to fix build resolution
const heroBackground = 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=1920&q=80&auto=format&fit=crop';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { isAuthenticated } = useAuth();
  const [freestylePrompt, setFreestylePrompt] = useState('');
  const [freestyleImages, setFreestyleImages] = useState<File[]>([]);
  const [isFreestyleSubmitted, setIsFreestyleSubmitted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Auto-save freestyle input when it changes
  useEffect(() => {
    if (freestylePrompt || freestyleImages.length > 0) {
      saveFreestyleInput(freestylePrompt, freestyleImages);
    }
  }, [freestylePrompt, freestyleImages]);

  const handleNavigateWithAuth = (destination: string) => {
    if (!isAuthenticated) {
      setAuthRedirect(destination);
      toast.info('Sign in to continue creating your tattoo', {
        description: 'Your progress will be saved'
      });
      onNavigate('auth');
    } else {
      onNavigate(destination);
    }
  };

  const handleGenerateFreestyle = async () => {
    if (!freestylePrompt.trim()) {
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      // Save input before showing auth prompt
      saveFreestyleInput(freestylePrompt, freestyleImages);
      setAuthRedirect('generate');
      
      // Show custom auth prompt toast
      showAuthPromptToast({
        onSignIn: () => onNavigate('auth'),
        onSignUp: () => onNavigate('pricing'),
      });
      return;
    }

    // User is authenticated - redirect to generator page with saved data
    onNavigate('generate');
  };

  const handleGeneratorButtonClick = () => {
    // Check if the freestyle card has been submitted
    if (!isFreestyleSubmitted) {
      toast.error('Please submit your idea first', {
        description: 'Click the SUBMIT button in the card above'
      });
      return;
    }

    // Save the data regardless of authentication status
    saveFreestyleInput(freestylePrompt, freestyleImages);
    setAuthRedirect('generate');

    // If user is authenticated, go directly to generator
    if (isAuthenticated) {
      onNavigate('generate');
      return;
    }

    // User is not authenticated and has data - redirect to pricing page
    onNavigate('pricing');
  };

  // Generate 48 unique cards with different titles
  const tattooCardData = [
    // Life Ink category (12 unique titles)
    { title: 'Memorial Ink', category: 'life' },
    { title: 'Birth Story', category: 'life' },
    { title: 'Family Tree', category: 'life' },
    { title: 'Heritage Marks', category: 'life' },
    { title: 'Life Journey', category: 'life' },
    { title: 'Sacred Mantras', category: 'life' },
    { title: 'Milestone Art', category: 'life' },
    { title: 'Spirit Symbols', category: 'life' },
    { title: 'Legacy Ink', category: 'life' },
    { title: 'Ancestor Tribute', category: 'life' },
    { title: 'Soul Marks', category: 'life' },
    { title: 'Memory Lane', category: 'life' },
    
    // Weird Shit category (12 unique titles)
    { title: 'Glitch Art', category: 'weird' },
    { title: 'Psychedelic Trip', category: 'weird' },
    { title: 'Cosmic Horror', category: 'weird' },
    { title: 'Surreal Dreams', category: 'weird' },
    { title: 'Abstract Chaos', category: 'weird' },
    { title: 'Cyberpunk Edge', category: 'weird' },
    { title: 'Biomechanical', category: 'weird' },
    { title: 'Dark Fantasy', category: 'weird' },
    { title: 'Mind Bender', category: 'weird' },
    { title: 'Dystopian Vibes', category: 'weird' },
    { title: 'Avant-Garde', category: 'weird' },
    { title: 'Experimental Ink', category: 'weird' },
    
    // Couples category (12 unique titles)
    { title: 'Lock & Key', category: 'couples' },
    { title: 'Puzzle Hearts', category: 'couples' },
    { title: 'Infinity Bond', category: 'couples' },
    { title: 'Twin Flames', category: 'couples' },
    { title: 'Soul Mates', category: 'couples' },
    { title: 'King & Queen', category: 'couples' },
    { title: 'Coordinates', category: 'couples' },
    { title: 'His & Hers', category: 'couples' },
    { title: 'Inside Jokes', category: 'couples' },
    { title: 'Song Lyrics', category: 'couples' },
    { title: 'Date Night', category: 'couples' },
    { title: 'Love Language', category: 'couples' },
    
    // Cover-Up category (12 unique titles)
    { title: 'Phoenix Rising', category: 'coverup' },
    { title: 'Fresh Start', category: 'coverup' },
    { title: 'New Chapter', category: 'coverup' },
    { title: 'Blackout Magic', category: 'coverup' },
    { title: 'Scar Healer', category: 'coverup' },
    { title: 'Ink Revival', category: 'coverup' },
    { title: 'Name Eraser', category: 'coverup' },
    { title: 'Style Upgrade', category: 'coverup' },
    { title: 'Color Fix', category: 'coverup' },
    { title: 'Regret-Free', category: 'coverup' },
    { title: 'Second Chance', category: 'coverup' },
    { title: 'Transform It', category: 'coverup' },
  ];

  // Use fallback Unsplash images for carousel
  const fallbackImages = [
    'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=800',
    'https://images.unsplash.com/photo-1598371611808-d4b1e6c68c57?w=800',
    'https://images.unsplash.com/photo-1590246814883-57c511a48846?w=800',
    'https://images.unsplash.com/photo-1610830626484-1504b6b4a1b9?w=800',
    'https://images.unsplash.com/photo-1606265752439-1f18756aa5fc?w=800',
    'https://images.unsplash.com/photo-1565058142-a2c0c5de6b73?w=800',
  ];

  // Map each unique title to fallback images (cycle through them)
  const tattooCards = tattooCardData.map((card, index) => ({
    title: card.title,
    image: fallbackImages[index % fallbackImages.length],
    category: card.category
  }));

  const useCases = [
    {
      image: 'https://images.unsplash.com/photo-1605647533135-51b5906087d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
      title: 'Memorial Tattoos: Honor loved ones with AI-designed memorial art',
      description: 'Create meaningful tributes that celebrate the lives of those you cherish',
    },
    {
      image: 'https://images.unsplash.com/photo-1605381942640-0a262ce59788?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
      title: 'Relationship Milestones: Celebrate anniversaries and special moments together',
      description: 'Design matching tattoos that symbolize your unique bond',
    },
    {
      image: 'https://images.unsplash.com/photo-1722149493669-30098ef78f9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
      title: 'Creative Brainstorming: Not sure what you want? Let AI help you discover it',
      description: 'Chat with TaTTTy to explore personalized tattoo concepts',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Martinez',
      location: 'Venice Beach, CA',
      rating: 5,
      text: 'TaTTTy helped me create the perfect tattoo design that tells my story. The AI understood exactly what I wanted!',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    {
      name: 'Michael Chen',
      location: 'Downtown LA',
      rating: 5,
      text: 'As a tattoo artist, I use TaTTTy to brainstorm ideas with my clients. It\'s revolutionized my consultation process.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    {
      name: 'Jessica Thompson',
      location: 'Santa Monica',
      rating: 5,
      text: 'The couples tattoo feature is amazing! My partner and I designed matching tattoos that perfectly represent us.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
  ];

  return (
    <div className="min-h-screen bg-[#2a2a2a]">
      <section className="relative min-h-[calc(90vh+55px)] flex items-center justify-center overflow-hidden rounded-b-[100px] border-b-4" style={{ borderColor: '#57f1d6', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8)' }}>
        <div className="absolute inset-0">
          <img 
            src={heroBackground} 
            alt="AI Tattoo Artist Background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(87,241,214,0.08),transparent_50%)] mx-[0px] px-[0px] p-[0px] bg-[rgba(0,0,0,0.61)] my-[0px] m-[0px]"></div>
        
        <div className="relative z-10 w-full flex items-center justify-center min-h-[50vh] mx-[50px] my-[0px] mt-[260px] mr-[800px] mb-[0px] ml-[0px] py-[0px] px-[20px] pt-[240px] pr-[20px] pb-[0px] pl-[0px] rounded-[0px]">

        </div>
        
      </section>

      <section className="py-6 relative z-10" style={{ backgroundColor: 'transparent' }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 py-12 md:py-16">
            <BlackButton label="EXPERIENCE NOW" onClick={() => handleNavigateWithAuth('generate')} />
            <ColorButton label="EXPLORE UNIQUE" onClick={() => handleNavigateWithAuth('community')} />
          </div>
        </div>
      </section>

      {/* Your Story | Your Pain | Your Power | Into Ink section */}
      <section className="py-12 md:py-16 lg:py-20 rounded-t-[100px] border-t-4 relative z-10" style={{ backgroundColor: '#2d2d2d', borderColor: '#57f1d6', boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.8)' }}>
        <div className="container mx-auto px-4">
          <div className="mb-10 md:mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 lg:gap-12 items-center justify-items-center">
              <YourStory />
              <YourPain />
              <YourPower />
              <IntoInk />
            </div>
          </div>
          
          {/* Horizontal Swipeable Carousel */}
          <div className="relative w-screen overflow-hidden -mx-[1px]" style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}>
            <Carousel
              opts={{
                align: "start",
                loop: true,
                dragFree: true,
                skipSnaps: false,
                containScroll: "trimSnaps",
              }}
              className="w-full touch-pan-x"
            >
              <CarouselContent className="ml-0 pl-[1px]">
                {tattooCards.map((card, index) => (
                  <CarouselItem 
                    key={index}
                    className="pl-4 basis-[280px] min-w-[280px]"
                  >
                    <TattooImageCard
                      image={card.image}
                      title={card.title}
                      onClick={() => handleNavigateWithAuth('generate')}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          {/* Stats Section */}
          <div className="mt-12 md:mt-16">
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 lg:gap-12 px-4">
              <div className="text-center">
                <div className="font-[Orbitron] text-accent mb-1 text-[48px]">100+</div>
                <div className="text-muted-foreground text-[36px]">Styles</div>
              </div>
              
              <div className="hidden sm:block h-12 w-[1px] bg-border"></div>
              
              <div className="text-center">
                <div className="font-[Orbitron] text-accent mb-1 text-[48px]">100+</div>
                <div className="text-muted-foreground text-[36px]">Categories</div>
              </div>
              
              <div className="hidden sm:block h-12 w-[1px] bg-border"></div>
              
              <div className="text-center">
                <div className="font-[Orbitron] text-accent mb-1 text-[48px]">1K+</div>
                <div className="text-muted-foreground text-[36px]">Designs</div>
              </div>
              
              <div className="hidden sm:block h-12 w-[1px] bg-border"></div>
              
              <div className="text-center">
                <div className="font-[Orbitron] text-accent mb-1 text-[48px]">10K+</div>
                <div className="text-muted-foreground text-[36px]">Created</div>
              </div>
              
              <div className="hidden sm:block h-12 w-[1px] bg-border"></div>
              
              <div className="text-center">
                <div className="font-[Orbitron] text-accent mb-1 text-[48px]">5K+</div>
                <div className="text-muted-foreground text-[36px]">TaTTTied</div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10 md:mt-12">
            <Button size="lg" onClick={() => handleNavigateWithAuth('features')} variant="outline" className="text-base">
              <Palette className="mr-2" size={20} />
              Explore All Features
            </Button>
          </div>
        </div>
      </section>

      {/* Try Now for Free section */}
      <section className="pt-24 md:pt-28 lg:pt-32 pb-16 md:pb-20 lg:pb-24 rounded-t-[100px] rounded-b-[100px] border-t-4 border-l-4 border-r-4 border-b-4 relative z-20" style={{ backgroundColor: '#2d2d2d', borderColor: '#57f1d6', boxShadow: '0 0 40px 10px rgba(0, 0, 0, 0.8)' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-24 md:mb-32 lg:mb-40">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 md:mb-4 font-[Rock_Salt]" style={{ 
              color: '#57f1d6',
              textShadow: '0px 4px 8px rgba(0, 0, 0, 0.9), 0px 8px 16px rgba(0, 0, 0, 0.7), 0px 12px 24px rgba(0, 0, 0, 0.5)'
            }}>
              Try now for free
            </h2>
            <p className="text-muted-foreground mx-auto text-[24px] font-[Roboto_Condensed]">
              Zero commitment, infinite possibilities — start creating in seconds
            </p>
          </div>

          {/* ROW 1: FreestyleCard + Text */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24 xl:gap-32 mb-32 md:mb-40 lg:mb-48 max-w-[1600px] mx-auto">
            <div className="w-full lg:w-1/2 max-w-xl">
              <FreestyleCard 
                title="Literally Say Anything" 
                showUpload={true}
                onTextChange={setFreestylePrompt}
                onImagesChange={setFreestyleImages}
                onSubmitted={setIsFreestyleSubmitted}
                onNavigate={onNavigate}
              />
            </div>
            <div className="flex items-center justify-center w-full lg:w-1/2">
              <div className="text-center">
                <h3 className="mb-3 font-[Orbitron]" style={{ fontSize: 'clamp(32px, 6vw, 64px)', textShadow: '0px 4px 12px rgba(0, 0, 0, 0.95), 0px 8px 24px rgba(0, 0, 0, 0.8), 0px 12px 32px rgba(0, 0, 0, 0.6)' }}>tell TaTTTy</h3>
                <h3 className="mb-3 font-[Orbitron]" style={{ fontSize: 'clamp(36px, 8vw, 96px)', textShadow: '0px 4px 12px rgba(0, 0, 0, 0.95), 0px 8px 24px rgba(0, 0, 0, 0.8), 0px 12px 32px rgba(0, 0, 0, 0.6)' }}>your</h3>
                <h3 className="font-[Orbitron]" style={{ fontSize: 'clamp(24px, 4vw, 48px)', color: '#57f1d6', textShadow: '0px 4px 12px rgba(0, 0, 0, 0.95), 0px 8px 24px rgba(0, 0, 0, 0.8), 0px 12px 32px rgba(0, 0, 0, 0.6)' }}>dream tattoo</h3>
              </div>
            </div>
          </div>

          {/* ROW 2: Ask TaTTTy Button */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24 xl:gap-32 mb-32 md:mb-40 lg:mb-48 max-w-[1600px] mx-auto">
            <div className="flex items-center justify-center w-full lg:w-1/2 order-2 lg:order-1">
              <div className="text-center">
                <h3 className="mb-3 font-[Orbitron]" style={{ fontSize: 'clamp(32px, 6vw, 64px)', textShadow: '0px 4px 12px rgba(0, 0, 0, 0.95), 0px 8px 24px rgba(0, 0, 0, 0.8), 0px 12px 32px rgba(0, 0, 0, 0.6)' }}>stuck? don't</h3>
                <h3 className="mb-3 font-[Orbitron]" style={{ fontSize: 'clamp(32px, 6vw, 64px)', textShadow: '0px 4px 12px rgba(0, 0, 0, 0.95), 0px 8px 24px rgba(0, 0, 0, 0.8), 0px 12px 32px rgba(0, 0, 0, 0.6)' }}>know what</h3>
                <h3 className="mb-3 font-[Orbitron]" style={{ fontSize: 'clamp(36px, 8vw, 96px)', textShadow: '0px 4px 12px rgba(0, 0, 0, 0.95), 0px 8px 24px rgba(0, 0, 0, 0.8), 0px 12px 32px rgba(0, 0, 0, 0.6)' }}>to say?</h3>
                <h3 className="font-[Orbitron]" style={{ fontSize: 'clamp(24px, 4vw, 48px)', color: '#57f1d6', textShadow: '0px 4px 12px rgba(0, 0, 0, 0.95), 0px 8px 24px rgba(0, 0, 0, 0.8), 0px 12px 32px rgba(0, 0, 0, 0.6)' }}>TaTTTy got you</h3>
              </div>
            </div>
            <div className="w-full lg:w-1/2 flex justify-center order-1 lg:order-2">
              <button
                className="px-12 py-6 bg-gradient-to-r from-accent/80 to-accent transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(87,241,214,0.6)] flex items-center gap-3"
                style={{
                  backgroundColor: '#57f1d6',
                  color: '#0C0C0D',
                  boxShadow: '0 0 15px rgba(87, 241, 214, 0.4)',
                  borderRadius: '12px',
                  letterSpacing: '2px',
                }}
              >
                <span className="text-xl text-[rgb(0,0,0)] text-[32px]"><Sparkles size={20} color="#0C0C0D" className="inline" /></span>
                <span className="text-xl font-[Orbitron] text-[24px] font-bold">Ask TaTTTy</span>
              </button>
            </div>
          </div>

          {/* ROW 3: DemoResultsCard + Text */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24 xl:gap-32 max-w-[1600px] mx-auto mb-16">
            <div className="w-full lg:w-1/2 max-w-xl">
              <DemoResultsCard 
                aspectRatio="square"
                maxWidth="2xl"
              />
            </div>
            <div className="flex items-center justify-center w-full lg:w-1/2">
              <div className="text-center">
                <h3 className="mb-3 font-[Orbitron]" style={{ fontSize: 'clamp(32px, 6vw, 64px)', textShadow: '0px 4px 12px rgba(0, 0, 0, 0.95), 0px 8px 24px rgba(0, 0, 0, 0.8), 0px 12px 32px rgba(0, 0, 0, 0.6)' }}>tap, and</h3>
                <h3 className="mb-3 font-[Orbitron]" style={{ fontSize: 'clamp(32px, 6vw, 64px)', textShadow: '0px 4px 12px rgba(0, 0, 0, 0.95), 0px 8px 24px rgba(0, 0, 0, 0.8), 0px 12px 32px rgba(0, 0, 0, 0.6)' }}>watch your</h3>
                <h3 className="mb-3 font-[Orbitron]" style={{ fontSize: 'clamp(48px, 8vw, 96px)', textShadow: '0px 4px 12px rgba(0, 0, 0, 0.95), 0px 8px 24px rgba(0, 0, 0, 0.8), 0px 12px 32px rgba(0, 0, 0, 0.6)' }}>dreams.</h3>
                <h3 className="font-[Orbitron]" style={{ fontSize: 'clamp(24px, 4vw, 48px)', color: '#57f1d6', textShadow: '0px 4px 12px rgba(0, 0, 0, 0.95), 0px 8px 24px rgba(0, 0, 0, 0.8), 0px 12px 32px rgba(0, 0, 0, 0.6)' }}>become ink.</h3>
              </div>
            </div>
          </div>

          {/* Generator Button */}
          <div className="flex justify-center">
            <Gen2Land onClick={handleGeneratorButtonClick} />
          </div>
        </div>
      </section>

      <section className="pt-24 md:pt-28 lg:pt-32 pb-12 md:pb-16 lg:pb-20 relative z-10" style={{ backgroundColor: '#2a2a2a' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 md:mb-4 font-[Rock_Salt]" style={{ 
              color: '#57f1d6',
              textShadow: '0px 4px 8px rgba(0, 0, 0, 0.9), 0px 8px 16px rgba(0, 0, 0, 0.7), 0px 12px 24px rgba(0, 0, 0, 0.5)'
            }}>
              Popular use cases
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4 font-[Roboto_Condensed] text-[24px]">
              See how people are using TaTTTy to create meaningful designs
            </p>
          </div>
          
          <FrostCardGrid>
            {useCases.map((useCase, index) => (
              <ModernImageCard
                key={index}
                image={useCase.image}
                title={useCase.title}
                description={useCase.description}
                onClick={() => onNavigate('features')}
              />
            ))}
          </FrostCardGrid>
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-20 relative" style={{ backgroundColor: '#2a2a2a' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-20 lg:mb-32">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 md:mb-4 font-[Rock_Salt]" style={{ 
              color: '#57f1d6',
              textShadow: '0px 4px 8px rgba(0, 0, 0, 0.9), 0px 8px 16px rgba(0, 0, 0, 0.7), 0px 12px 24px rgba(0, 0, 0, 0.5)'
            }}>
              Our journey
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4 text-[24px] font-[Roboto_Condensed]">
              From LA streets to global innovation
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-accent via-accent/50 to-accent"></div>
              
              <div className="relative mb-8 md:mb-12">
                <div className="flex items-center justify-center mb-4">
                  <div className="md:absolute left-1/2 transform md:-translate-x-1/2 w-12 h-12 md:w-16 md:h-16 bg-accent border-2 md:border-4 border-background rounded-full flex items-center justify-center text-background z-10 text-lg md:text-[24px] font-[Roboto_Slab]">
                    2023
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 md:-mt-2">
                  <div className="flex justify-center md:justify-end md:pr-12">
                    <TimelineCard title="Founded in LA" description="TaTTTy was born in the heart of Los Angeles tattoo culture." />
                  </div>
                  <div className="hidden md:block"></div>
                </div>
              </div>

              <div className="relative mb-8 md:mb-12">
                <div className="flex items-center justify-center mb-4">
                  <div className="md:absolute left-1/2 transform md:-translate-x-1/2 w-12 h-12 md:w-16 md:h-16 bg-accent border-2 md:border-4 border-background rounded-full flex items-center justify-center text-background z-10 text-lg md:text-[24px] font-[Roboto_Slab]">
                    2024
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 md:-mt-2">
                  <div className="hidden md:block"></div>
                  <div className="flex justify-center md:justify-start md:pl-12">
                    <TimelineCard title="AI Innovation" description="Launched revolutionary AI tattoo generation technology." />
                  </div>
                </div>
              </div>

              <div className="relative mb-8 md:mb-12">
                <div className="flex items-center justify-center mb-4">
                  <div className="md:absolute left-1/2 transform md:-translate-x-1/2 w-12 h-12 md:w-16 md:h-16 bg-accent border-2 md:border-4 border-background rounded-full flex items-center justify-center text-background z-10 text-lg md:text-[24px] font-[Roboto_Slab]">
                    2025
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 md:-mt-2">
                  <div className="flex justify-center md:justify-end md:pr-12">
                    <TimelineCard title="Community Growth" description="Over 100,000 tattoos designed and a thriving global community." />
                  </div>
                  <div className="hidden md:block"></div>
                </div>
              </div>

              <div className="relative mb-8 md:mb-12">
                <div className="flex items-center justify-center mb-4">
                  <div className="md:absolute left-1/2 transform md:-translate-x-1/2 w-12 h-12 md:w-16 md:h-16 bg-accent border-2 md:border-4 border-background rounded-full flex items-center justify-center text-background z-10 text-lg md:text-[24px] font-[Roboto_Slab]">
                    2026
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-20 relative" style={{ backgroundColor: '#2a2a2a' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 md:mb-4 font-[Rock_Salt]" style={{ 
              color: '#57f1d6',
              textShadow: '0px 4px 8px rgba(0, 0, 0, 0.9), 0px 8px 16px rgba(0, 0, 0, 0.7), 0px 12px 24px rgba(0, 0, 0, 0.5)'
            }}>
              What our users say
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mx-auto text-[24px] px-[16px] py-[0px] my-[0px] font-[Roboto_Condensed]">
              Join thousands of satisfied customers in Los Angeles and beyond
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                name={testimonial.name}
                location={testimonial.location}
                rating={testimonial.rating}
                text={testimonial.text}
                avatar={testimonial.avatar}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-20 relative overflow-hidden z-30" style={{ backgroundColor: '#2a2a2a' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(87,241,214,0.15),transparent_60%)]"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6 font-[Rock_Salt]" style={{ 
            color: '#57f1d6',
            textShadow: '0px 4px 8px rgba(0, 0, 0, 0.9), 0px 8px 16px rgba(0, 0, 0, 0.7), 0px 12px 24px rgba(0, 0, 0, 0.5)'
          }}>
            Ready to create your story?
          </h2>
          <p className="text-base sm:text-lg mb-6 md:mb-8 text-muted-foreground max-w-2xl mx-auto px-4 text-[24px] font-[Roboto_Condensed]">
            Join thousands of people in Los Angeles and around the world who have created their perfect tattoo design with TaTTTy.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6" onClick={() => onNavigate('generate')}>
              <Sparkles className="mr-2" size={20} />
              Start Designing Now
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6" onClick={() => onNavigate('features')}>
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
