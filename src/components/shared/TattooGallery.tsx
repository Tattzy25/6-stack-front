import { useState } from 'react';
import { Heart, X } from 'lucide-react';
import { Card } from '../ui/card';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Button } from '../ui/button';
import { Dialog, DialogContent } from '../ui/dialog';
import { useAuth } from '../../contexts/AuthContext';

interface Design {
  id: string;
  title: string;
  image: string;
}

interface TattooGalleryProps {
  designs: Design[];
  displayCount: number;
  onLoadMore: () => void;
  hasMore: boolean;
  columns?: 2 | 4;
  title?: string;
}

export function TattooGallery({
  designs,
  displayCount,
  onLoadMore,
  hasMore,
  columns = 4,
  title,
}: TattooGalleryProps) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { isAuthenticated } = useAuth();

  // Load favorites from localStorage on mount
  useState(() => {
    const saved = localStorage.getItem('tattty_gallery_favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  });

  const displayedDesigns = designs.slice(0, displayCount);

  const handleFavorite = (image: string, title: string) => {
    if (!isAuthenticated) {
      // Silent failure for non-authenticated users
      return;
    }

    const isFavorited = favorites.includes(image);
    let newFavorites: string[];

    if (isFavorited) {
      newFavorites = favorites.filter(fav => fav !== image);
    } else {
      newFavorites = [...favorites, image];
      // Also save to dashboard favorites
      const dashboardFavorites = JSON.parse(localStorage.getItem('tattty_favorites') || '[]');
      dashboardFavorites.push({ 
        image, 
        title,
        artist: 'Gallery',
        savedAt: new Date().toISOString() 
      });
      localStorage.setItem('tattty_favorites', JSON.stringify(dashboardFavorites));
    }

    setFavorites(newFavorites);
    localStorage.setItem('tattty_gallery_favorites', JSON.stringify(newFavorites));
  };

  return (
    <div className="w-full space-y-6 pb-6">
      {/* Title */}
      {title && (
        <div className="w-full text-center mb-8" style={{ fontFamily: 'Rock Salt, cursive' }}>
          <div className="text-[40px]" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.9), 0 8px 24px rgba(0, 0, 0, 0.8)' }}>GET</div>
          <div className="text-[48px]" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.9), 0 8px 24px rgba(0, 0, 0, 0.8)' }}>INSPIRED</div>
        </div>
      )}
      
      {/* Gallery Grid */}
      <div className={`grid ${columns === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'} gap-4`}>
        {displayedDesigns.map((design) => (
          <div
            key={design.id}
            className="group relative aspect-square rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-all"
            style={{
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.9), 0 0 60px rgba(0, 0, 0, 0.7)',
            }}
          >
            {/* Heart Icon */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFavorite(design.image, design.title);
              }}
              className="absolute top-2 right-2 z-10 p-2 rounded-full transition-all"
              style={{
                backgroundColor: favorites.includes(design.image) ? '#57f1d6' : 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Heart
                size={18}
                fill={favorites.includes(design.image) ? '#0C0C0D' : 'none'}
                style={{
                  color: favorites.includes(design.image) ? '#0C0C0D' : '#ffffff',
                }}
              />
            </button>

            {/* Image - Click to open lightbox */}
            <button 
              className="w-full h-full"
              onClick={() => setLightboxImage(design.image)}
            >
              <ImageWithFallback
                src={design.image}
                alt={design.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                <span className="text-xs truncate w-full">{design.title}</span>
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={onLoadMore}
            className="px-8 py-4"
            style={{
              backgroundColor: '#57f1d6',
              color: '#0C0C0D',
            }}
          >
            Load More Designs ({displayCount} of {designs.length})
          </Button>
        </div>
      )}

      {/* No Results */}
      {designs.length === 0 && (
        <Card className="p-12 border-2 border-accent/20" style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          background: 'linear-gradient(90deg, hsla(0, 0%, 100%, 0.2), hsla(0, 0%, 100%, 0.05))',
          borderRadius: '70px',
          boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
        }}>
          <div className="text-center">
            <p className="text-muted-foreground">
              Oops! No designs found. Please try again with different keywords.
            </p>
          </div>
        </Card>
      )}

      {/* Lightbox Dialog */}
      <Dialog open={!!lightboxImage} onOpenChange={() => setLightboxImage(null)}>
        <DialogContent 
          className="max-w-6xl p-0 border-0"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.98)' }}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 z-50 p-3 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={28} style={{ color: '#ffffff' }} />
          </button>
          
          {lightboxImage && (
            <div className="relative p-8">
              <img
                src={lightboxImage}
                alt="Gallery design"
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
              />
              
              {/* Actions Bar */}
              <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-4 px-8">
                <Button
                  onClick={() => handleFavorite(lightboxImage, 'Gallery Design')}
                  className="px-6 py-4"
                  style={{
                    backgroundColor: favorites.includes(lightboxImage) ? '#57f1d6' : 'rgba(255, 255, 255, 0.15)',
                    color: favorites.includes(lightboxImage) ? '#0C0C0D' : '#ffffff',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Heart
                    size={20}
                    fill={favorites.includes(lightboxImage) ? '#0C0C0D' : 'none'}
                    className="mr-2"
                  />
                  {favorites.includes(lightboxImage) ? 'Saved to Favorites' : 'Save to Favorites'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
