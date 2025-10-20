import { useState } from 'react';
import { LucideIcon, Wand2, Sparkles, Zap, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface GeneratorType {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

interface GeneratorTypeCardProps {
  selectedGenerator?: string;
  onSelectGenerator?: (id: string) => void;
}

interface SingleCardProps {
  type: GeneratorType;
  isSelected: boolean;
  isExpanded: boolean;
  onCardClick: () => void;
}

function SingleGeneratorCard({ type, isSelected, isExpanded, onCardClick }: SingleCardProps) {
  const Icon = type.icon;
  
  return (
    <Card 
      onClick={onCardClick}
      className="relative overflow-hidden border-2 transition-all cursor-pointer"
      style={isSelected ? {
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        background: 'linear-gradient(90deg, hsla(169, 85%, 64%, 0.2), hsla(169, 85%, 64%, 0.05))',
        borderRadius: '70px',
        borderColor: 'rgba(87, 241, 214, 0.4)',
        boxShadow: '0 0 40px rgba(87, 241, 214, 0.3), 0 0 40px rgba(0, 0, 0, 0.8)',
      } : {
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        background: 'linear-gradient(90deg, hsla(0, 0%, 100%, 0.2), hsla(0, 0%, 100%, 0.05))',
        borderRadius: '70px',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)',
      }}
    >
      <CardContent className="p-4 md:p-6">
        {/* Main Content */}
        <div className="flex md:flex-col items-center md:text-center gap-3 md:gap-2">
          <Icon 
            size={32}
            className="text-muted-foreground flex-shrink-0 md:mx-auto" 
            style={{ filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.8))' }}
          />
          <div className="flex-1 md:flex-none text-left md:text-center">
            <div className="text-base md:text-lg font-[Orbitron]" style={{ letterSpacing: '2px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>
              {type.title}
            </div>
          </div>
          {/* Chevron only on mobile */}
          <ChevronDown 
            size={20}
            className={`md:hidden text-muted-foreground transition-transform duration-300 ml-auto ${isExpanded ? 'rotate-180' : ''}`}
            style={{ filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.8))' }}
          />
        </div>

        {/* Desktop: Always visible description */}
        <div className="hidden md:block mt-4 pt-4" style={{ borderTop: '1px solid rgba(87, 241, 214, 0.2)' }}>
          <p className="text-lg text-muted-foreground leading-relaxed text-center">
            {type.description}
          </p>
        </div>

        {/* Mobile: Slide-out Description on click */}
        <div 
          className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: isExpanded ? '200px' : '0',
            opacity: isExpanded ? 1 : 0,
          }}
        >
          <div 
            className="pt-3 mt-3"
            style={{
              borderTop: '1px solid rgba(87, 241, 214, 0.2)',
            }}
          >
            <p className="text-base text-muted-foreground leading-relaxed text-center">
              {type.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function GeneratorTypeCard({ 
  selectedGenerator = 'tattty',
  onSelectGenerator 
}: GeneratorTypeCardProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const generatorTypes: GeneratorType[] = [
    { 
      id: 'tattty', 
      title: 'TaTTTy', 
      description: 'AI freestyle generator - create any tattoo design from scratch with complete creative control',
      icon: Sparkles 
    },
    { 
      id: 'freestyle', 
      title: 'Freestyle', 
      description: 'Complete creative freedom - describe any tattoo concept and generate custom designs',
      icon: Wand2 
    },
    { 
      id: 'brainstorm', 
      title: 'Brainstorm', 
      description: 'Explore and develop ideas - perfect for refining concepts and discovering variations',
      icon: Zap 
    },
  ];

  const handleCardClick = (id: string) => {
    // Select the generator
    onSelectGenerator?.(id);
    
    // Toggle description expansion - only for mobile
    setExpandedCard(prev => prev === id ? null : id);
  };

  return (
    <section className="relative overflow-hidden rounded-b-[100px] border-b-4 pb-[120px]" style={{ borderColor: '#57f1d6', boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.8)' }}>
      <div className="space-y-4 md:space-y-6 px-4">
        {/* Floating Title */}
        <h3 className="text-xl md:text-2xl font-[Orbitron] text-center text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)', letterSpacing: '3px' }}>
          What's the vibe?
        </h3>
        
        {/* Generator Cards - Each in its own container */}
        <div className="flex flex-col md:grid md:grid-cols-3 gap-3 md:gap-4 pt-[100px]">
          {generatorTypes.map((type) => (
            <SingleGeneratorCard
              key={type.id}
              type={type}
              isSelected={selectedGenerator === type.id}
              isExpanded={expandedCard === type.id}
              onCardClick={() => handleCardClick(type.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
