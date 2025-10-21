import { useState } from 'react';
import { Search, Heart, X } from 'lucide-react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Button } from '../ui/button';
import { Dialog, DialogContent } from '../ui/dialog';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

interface FilterGallerySectionProps {
  designs?: Array<{
    id: string;
    title: string;
    image: string;
  }>;
}

type FilterType = 'style' | 'color' | 'size' | 'vibe';

export function FilterGallerySection({ designs = [] }: FilterGallerySectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<FilterType, string | null>>({
    style: null,
    color: null,
    size: null,
    vibe: null,
  });
  const [displayCount, setDisplayCount] = useState(16);
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

  const filterOptions = {
    style: ['Traditional', 'Realism', 'Watercolor', 'Minimalist', 'Geometric', 'Japanese'],
    color: ['Black & Grey', 'Color', 'Blackwork'],
    size: ['Small', 'Medium', 'Large'],
    vibe: ['Dark', 'Bright', 'Weird', 'Classic'],
  };

  const toggleFilter = (category: FilterType, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [category]: prev[category] === value ? null : value,
    }));
  };

  const clearAllFilters = () => {
    setActiveFilters({
      style: null,
      color: null,
      size: null,
      vibe: null,
    });
    setSearchQuery('');
  };

  const hasActiveFilters = Object.values(activeFilters).some(v => v !== null) || searchQuery.length > 0;

  // Generate infinite designs for the gallery
  const defaultDesigns = Array.from({ length: 100 }, (_, i) => ({
    id: `design-${i + 1}`,
    title: `Tattoo Design ${i + 1}`,
    image: `https://images.unsplash.com/photo-1605647533135-51b5906087d0?w=400&h=400&fit=crop&sig=${i}`
  }));

  const allDesigns = designs.length > 0 ? designs : defaultDesigns;

  const filteredDesigns = allDesigns.filter(design =>
    design.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedDesigns = filteredDesigns.slice(0, displayCount);
  const hasMore = displayCount < filteredDesigns.length;

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 16);
  };

  const handleFavorite = (image: string, title: string) => {
    if (!isAuthenticated) {
      toast.info('Sign in to save favorites', {
        description: 'Create an account to save designs'
      });
      return;
    }

    const isFavorited = favorites.includes(image);
    let newFavorites: string[];

    if (isFavorited) {
      newFavorites = favorites.filter(fav => fav !== image);
      toast.success('Removed from favorites');
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
      toast.success('Saved to favorites!', {
        description: 'View in your dashboard'
      });
    }

    setFavorites(newFavorites);
    localStorage.setItem('tattty_gallery_favorites', JSON.stringify(newFavorites));
  };

  return (
    <div className="w-full space-y-6 pb-6">
      {/* Filter Section Card */}
      <Card className="p-6 space-y-6 border-2 border-accent/20" style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        background: 'linear-gradient(90deg, hsla(0, 0%, 100%, 0.2), hsla(0, 0%, 100%, 0.05))',
        borderRadius: '70px',
        boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
      }}>
        {/* Search Bar */}
        <div className="flex justify-center">
          <div className="relative w-1/2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              type="text"
              placeholder="Search designs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="space-y-4">
          {/* Style Filters */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-muted-foreground uppercase tracking-wider">Style</label>
            </div>
            <div className="flex flex-wrap gap-2">
              {filterOptions.style.map((option) => (
                <Button
                  key={option}
                  variant="outline"
                  size="sm"
                  onClick={() => toggleFilter('style', option)}
                  className={`rounded-full border-2 ${
                    activeFilters.style === option 
                      ? 'bg-accent/10 border-accent text-accent' 
                      : 'bg-transparent border-accent/50 hover:border-accent hover:bg-accent/5'
                  }`}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          {/* Color Filters */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground uppercase tracking-wider">Color</label>
            <div className="flex flex-wrap gap-2">
              {filterOptions.color.map((option) => (
                <Button
                  key={option}
                  variant="outline"
                  size="sm"
                  onClick={() => toggleFilter('color', option)}
                  className={`rounded-full border-2 ${
                    activeFilters.color === option 
                      ? 'bg-accent/10 border-accent text-accent' 
                      : 'bg-transparent border-accent/50 hover:border-accent hover:bg-accent/5'
                  }`}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          {/* Size Filters */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground uppercase tracking-wider">Size</label>
            <div className="flex flex-wrap gap-2">
              {filterOptions.size.map((option) => (
                <Button
                  key={option}
                  variant="outline"
                  size="sm"
                  onClick={() => toggleFilter('size', option)}
                  className={`rounded-full border-2 ${
                    activeFilters.size === option 
                      ? 'bg-accent/10 border-accent text-accent' 
                      : 'bg-transparent border-accent/50 hover:border-accent hover:bg-accent/5'
                  }`}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          {/* Vibe Filters */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground uppercase tracking-wider">Vibe</label>
            <div className="flex flex-wrap gap-2">
              {filterOptions.vibe.map((option) => (
                <Button
                  key={option}
                  variant="outline"
                  size="sm"
                  onClick={() => toggleFilter('vibe', option)}
                  className={`rounded-full border-2 ${
                    activeFilters.vibe === option 
                      ? 'bg-accent/10 border-accent text-accent' 
                      : 'bg-transparent border-accent/50 hover:border-accent hover:bg-accent/5'
                  }`}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          {/* Clear All Button */}
          {hasActiveFilters && (
            <div className="pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Gallery Grid - 4 columns */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {displayedDesigns.map((design) => (
          <div
            key={design.id}
            className="group relative aspect-square rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-all"
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
            onClick={handleLoadMore}
            className="px-8 py-4"
            style={{
              backgroundColor: '#57f1d6',
              color: '#0C0C0D',
            }}
          >
            Load More Designs ({displayCount} of {filteredDesigns.length})
          </Button>
        </div>
      )}

      {/* No Results */}
      {filteredDesigns.length === 0 && (
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
