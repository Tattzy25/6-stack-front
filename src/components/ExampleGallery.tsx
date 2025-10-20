/**
 * Example Gallery Component
 * Displays example tattoo images from database
 */

import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getRandomExamples, getFeaturedExamples, ExampleImage } from '../utils/exampleImagesApi';

interface ExampleGalleryProps {
  category?: 'freestyle' | 'couples' | 'coverup' | 'extend';
  limit?: number;
  featured?: boolean;
  className?: string;
}

export function ExampleGallery({ 
  category, 
  limit = 6, 
  featured = false,
  className = '' 
}: ExampleGalleryProps) {
  const [examples, setExamples] = useState<ExampleImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExamples() {
      setLoading(true);
      try {
        const data = featured 
          ? await getFeaturedExamples()
          : await getRandomExamples(category, limit);
        setExamples(data);
      } catch (error) {
        console.error('Failed to load examples:', error);
      } finally {
        setLoading(false);
      }
    }

    loadExamples();
  }, [category, limit, featured]);

  if (loading) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${className}`}>
        {Array.from({ length: limit }).map((_, i) => (
          <div 
            key={i} 
            className="aspect-square bg-white/5 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (examples.length === 0) {
    return (
      <div className="text-center py-12 text-white/40">
        No examples found
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${className}`}>
      {examples.map((example) => (
        <div 
          key={example.id}
          className="group relative aspect-square overflow-hidden rounded-2xl"
        >
          <ImageWithFallback
            src={example.image_url}
            alt={example.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <h3 className="text-white font-[Orbitron] text-sm mb-1">
              {example.title}
            </h3>
            {example.description && (
              <p className="text-white/70 text-xs line-clamp-2">
                {example.description}
              </p>
            )}
            {example.tags && example.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {example.tags.slice(0, 3).map((tag) => (
                  <span 
                    key={tag}
                    className="px-2 py-0.5 bg-accent/20 text-accent text-[10px] rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
