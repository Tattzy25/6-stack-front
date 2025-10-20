import { Card, CardContent } from '../ui/card';
import { useState, useEffect } from 'react';

interface DemoResultsCardProps {
  aspectRatio?: '16/9' | '4/3' | '1/1' | 'square';
  maxWidth?: string;
  className?: string;
}

export function DemoResultsCard({ 
  aspectRatio = 'square',
  maxWidth = '2xl',
  className = '',
}: DemoResultsCardProps) {
  // Map aspect ratio to Tailwind class
  const aspectRatioMap = {
    '16/9': 'aspect-[16/9]',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
    'square': 'aspect-square',
  };

  const aspectClass = aspectRatioMap[aspectRatio];
  const maxWidthClass = `max-w-${maxWidth}`;

  const demoImages = [
    'https://images.unsplash.com/photo-1589299784109-62eec2521302?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YXR0b28lMjBhcnQlMjBibGFja3xlbnwxfHx8fDE3NjA3NzkxNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1758404255679-9afd847ede1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YXR0b28lMjBkZXNpZ24lMjBnZW9tZXRyaWN8ZW58MXx8fHwxNzYwNzg3NzM1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1759346771288-ac905d1b1abf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YXR0b28lMjBtaW5pbWFsaXN0fGVufDF8fHx8MTc2MDc4NzczNXww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1612991977455-7bf9e67d899c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YXR0b28lMjBzbGVldmUlMjBhcnRpc3RpY3xlbnwxfHx8fDE3NjA3ODc3MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080'
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % demoImages.length);
        setIsTransitioning(false);
      }, 800); // Spray paint animation duration
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [demoImages.length]);

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
        {/* Empty State - Demo only, no button */}
        <div className={`w-full ${aspectClass} ${maxWidthClass} mx-auto rounded-3xl overflow-hidden border-2 border-border/30 bg-muted/20 relative flex items-center justify-center`} style={{
          boxShadow: '15px 15px 30px rgba(0, 0, 0, 0.8), 30px 30px 60px rgba(0, 0, 0, 0.6)'
        }}>
          {/* Image layers */}
          {demoImages.map((imgSrc, idx) => (
            <img
              key={idx}
              src={imgSrc}
              alt={`Tattoo demo ${idx + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                opacity: idx === currentImageIndex ? 1 : 0,
                transform: idx === currentImageIndex && isTransitioning ? 'scale(1.1) rotate(2deg)' : 'scale(1) rotate(0deg)',
                transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
                filter: idx === currentImageIndex && isTransitioning ? 'brightness(1.2) contrast(1.1)' : 'brightness(1) contrast(1)',
              }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
