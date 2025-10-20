import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FeatureCarouselCardProps {
  title: string;
  features: string[]; // Array of feature names/descriptions
  images: string[]; // Array of image URLs
  onClick?: () => void;
}

export function FeatureCarouselCard({ 
  title, 
  features, 
  images, 
  onClick 
}: FeatureCarouselCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const nextSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  // Auto-advance carousel
  useState(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  });

  return (
    <div
      data-editable="true"
      onClick={onClick}
      className="group relative overflow-hidden rounded-[40px] border border-border bg-card/50 backdrop-blur-md hover:border-accent/50 transition-all duration-300 cursor-pointer"
    >
      {/* Image Carousel Section */}
      <div 
        className="relative h-48 overflow-hidden m-[10px] rounded-[30px]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Title Overlay */}
        <div className="absolute top-4 left-0 right-0 z-20 flex justify-center">
          <h3 
            className="text-2xl text-center px-4 py-2 font-[Rock_Salt] text-[32px]" 
            style={{ 
              WebkitTextStroke: '1.5px #57f1d6',
              textShadow: '3px 3px 6px rgba(0, 0, 0, 0.9), 0 0 10px #57f1d6, 0 0 20px rgba(87, 241, 214, 0.5)',
              filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.9))'
            }}
          >
            {title}
          </h3>
        </div>

        {/* Images */}
        <div className="relative w-full h-full">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`${title} ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Dark gradient overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-accent rounded-full p-2 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
          aria-label="Previous image"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-accent rounded-full p-2 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
          aria-label="Next image"
        >
          <ChevronRight size={20} />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-accent w-6' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* Features Carousel (Bottom Section) */}
      <div className="relative h-20 overflow-hidden">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`absolute inset-0 flex items-center justify-center p-4 transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <p className="text-sm text-muted-foreground text-center text-[18px] leading-tight">
              {feature}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
