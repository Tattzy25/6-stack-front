import { useState } from 'react';
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel';

export interface SwipeCardItem {
  title: string;
  image: string;
  id?: string;
}

interface CarouselSwipeCardsProps {
  items?: SwipeCardItem[];
  onSelect?: (title: string) => void;
  selectedItem?: string | null;
  basisSm?: string;
  basisMd?: string;
  basisLg?: string;
  className?: string;
}

export function CarouselSwipeCards({
  items = [],
  onSelect,
  selectedItem: externalSelectedItem,
  basisSm = '45%',
  basisMd = '32%',
  basisLg = '28%',
  className = '',
}: CarouselSwipeCardsProps) {
  const [internalSelectedItem, setInternalSelectedItem] = useState<string | null>(null);
  
  // Use external state if provided, otherwise use internal state
  const selectedItem = externalSelectedItem !== undefined ? externalSelectedItem : internalSelectedItem;
  
  const handleSelect = (title: string) => {
    if (externalSelectedItem === undefined) {
      setInternalSelectedItem(title);
    }
    onSelect?.(title);
  };

  // Return early if no items
  if (!items || items.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <p>No designs to display</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Carousel
        opts={{
          align: "start",
          loop: true,
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="m-0 px-0 py-2">
          {items.map((item, index) => {
            const isSelected = selectedItem === item.title;
            return (
              <CarouselItem 
                key={item.id || index} 
                className="pl-3 md:pl-4 py-3 md:py-4"
                style={{
                  flexBasis: `${basisSm}`,
                  ['--basis-md' as any]: basisMd,
                  ['--basis-lg' as any]: basisLg,
                }}
              >
                <style>{`
                  @media (min-width: 768px) {
                    .pl-3.md\\:pl-4 {
                      flex-basis: ${basisMd} !important;
                    }
                  }
                  @media (min-width: 1024px) {
                    .pl-3.md\\:pl-4 {
                      flex-basis: ${basisLg} !important;
                    }
                  }
                `}</style>
                <div
                  onClick={() => handleSelect(item.title)}
                  className={`relative aspect-square w-full rounded-3xl md:rounded-[2.5rem] overflow-hidden cursor-pointer transition-all duration-200 border-2 bg-black/30 backdrop-blur-[12px] group select-none ${
                    isSelected 
                      ? 'border-[#57f1d6] shadow-[0_0_15px_rgba(87,241,214,0.6),0_0_30px_rgba(87,241,214,0.4)] md:shadow-[0_0_20px_rgba(87,241,214,0.6),0_0_40px_rgba(87,241,214,0.4)] scale-105' 
                      : 'border-[#57f1d6]/40 hover:border-[#57f1d6]/70 active:scale-95'
                  }`}
                  style={{
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    background: 'linear-gradient(90deg, hsla(0, 0%, 100%, 0.2), hsla(0, 0%, 100%, 0.05))',
                    touchAction: 'pan-x'
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover pointer-events-none"
                    draggable="false"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-end p-3 md:p-4 ${
                    isSelected ? 'from-[#57f1d6]/20 via-black/50' : ''
                  }`}>
                    <h4 
                      className={`text-white text-center font-[Rock_Salt] transition-all duration-300 ${
                        isSelected ? 'text-[#57f1d6]' : ''
                      }`}
                      style={{
                        textShadow: isSelected 
                          ? '0 0 10px rgba(87,241,214,0.8), 2px 2px 4px rgba(0, 0, 0, 0.8)' 
                          : '2px 2px 4px rgba(0, 0, 0, 0.8), -1px -1px 2px rgba(0, 0, 0, 0.6)',
                        fontSize: 'clamp(10px, 2vw, 14px)'
                      }}
                    >
                      {item.title}
                    </h4>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
