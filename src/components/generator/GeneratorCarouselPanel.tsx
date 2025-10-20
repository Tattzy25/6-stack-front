import { lazy, Suspense, useState } from 'react';
import { Sparkle, Sparkles, MapPin, Ruler, Palette, Search } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { SelectionChip } from '../shared/SelectionChip';

// Lazy load heavy component
const CarouselSwipeCards = lazy(() => import('../CarouselSwipeCards').then(m => ({ default: m.CarouselSwipeCards })));

interface GeneratorCarouselPanelProps {
  styles: string[];
  placements: string[];
  selectedStyle: string | null;
  selectedPlacement: string | null;
  selectedSize: string | null;
  selectedColorPreference: string | null;
  outputType: 'color' | 'stencil';
  onSelectStyle: (style: string | null) => void;
  onSelectPlacement: (placement: string | null) => void;
  onSelectSize: (size: string | null) => void;
  onSelectColorPreference: (color: string | null) => void;
  onOutputTypeChange: (type: 'color' | 'stencil') => void;
}

export function GeneratorCarouselPanel({
  styles,
  placements,
  selectedStyle,
  selectedPlacement,
  selectedSize,
  selectedColorPreference,
  outputType,
  onSelectStyle,
  onSelectPlacement,
  onSelectSize,
  onSelectColorPreference,
  onOutputTypeChange,
}: GeneratorCarouselPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [placementSearchQuery, setPlacementSearchQuery] = useState('');
  const [sizeSearchQuery, setSizeSearchQuery] = useState('');
  const [colorSearchQuery, setColorSearchQuery] = useState('');

  // Filter only styles based on search query
  const filteredStyles = styles.filter(style =>
    style.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter only placements based on placement search query
  const filteredPlacements = placements.filter(placement =>
    placement.toLowerCase().includes(placementSearchQuery.toLowerCase())
  );
  
  const sizes = ['Small', 'Medium', 'Large', 'Extra Large'];
  // Filter only sizes based on size search query
  const filteredSizes = sizes.filter(size =>
    size.toLowerCase().includes(sizeSearchQuery.toLowerCase())
  );
  
  const colors = ['Black & Grey', 'Color', 'Blackwork', 'Watercolor'];
  // Filter only colors based on color search query
  const filteredColors = colors.filter(color =>
    color.toLowerCase().includes(colorSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Style Search Bar with Selection Chip */}
      <div className="space-y-3">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            type="text"
            placeholder="Search Styles"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-[40px] pr-[80px] h-20 bg-background/90 border-accent/50 focus-visible:border-accent focus-visible:ring-accent/50 !text-[20px] rounded-[8px] mt-12 mb-12 font-[Orbitron]"
          />
          {searchQuery && (
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
              {filteredStyles.length} result{filteredStyles.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        {selectedStyle && (
          <div className="flex justify-center">
            <SelectionChip 
              label="Style"
              value={selectedStyle}
              onClear={() => onSelectStyle(null)}
            />
          </div>
        )}
      </div>

      {/* Style Carousel */}
      <Card className="relative overflow-hidden border-2 border-accent/20 py-[0px] p-[0px]" style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        background: 'linear-gradient(90deg, hsla(0, 0%, 100%, 0.2), hsla(0, 0%, 100%, 0.05))',
        borderRadius: '70px',
        boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
      }}>
        <CardContent className="p-4 md:p-6 rounded-[90px]">
          <h3 className="m-0 p-0 mb-1 flex items-center justify-center gap-2 text-[24px] font-[Orbitron] text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)', letterSpacing: '5px' }}>
            <Sparkle size={24} />
            Style
          </h3>
          <Suspense fallback={<div className="flex items-center justify-center py-8"><Sparkles className="animate-spin text-accent" size={32} /></div>}>
            <CarouselSwipeCards
              items={filteredStyles.map(style => ({
                title: style,
                image: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400',
                id: style
              }))}
              selectedItem={selectedStyle}
              onSelect={onSelectStyle}
              basisSm="45%"
              basisMd="30%"
              basisLg="22%"
            />
          </Suspense>
        </CardContent>
      </Card>

      {/* Placement Search Bar with Selection Chip */}
      <div className="space-y-3">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            type="text"
            placeholder="Search Placements"
            value={placementSearchQuery}
            onChange={(e) => setPlacementSearchQuery(e.target.value)}
            className="pl-[40px] pr-[80px] h-20 bg-background/90 border-accent/50 focus-visible:border-accent focus-visible:ring-accent/50 !text-[20px] rounded-[8px] mt-12 mb-12 font-[Orbitron]"
          />
          {placementSearchQuery && (
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
              {filteredPlacements.length} result{filteredPlacements.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        {selectedPlacement && (
          <div className="flex justify-center">
            <SelectionChip 
              label="Placement"
              value={selectedPlacement}
              onClear={() => onSelectPlacement(null)}
            />
          </div>
        )}
      </div>

      {/* Placement Carousel */}
      <Card className="relative overflow-hidden border-2 border-accent/20" style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        background: 'linear-gradient(90deg, hsla(0, 0%, 100%, 0.2), hsla(0, 0%, 100%, 0.05))',
        borderRadius: '70px',
        boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
      }}>
        <CardContent className="p-4 md:p-6">
          <h3 className="m-0 p-0 mb-1 flex items-center justify-center gap-2 text-[24px] font-[Orbitron] text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)', letterSpacing: '5px' }}>
            <MapPin size={24} />
            Placement
          </h3>
          <Suspense fallback={<div className="flex items-center justify-center py-8"><Sparkles className="animate-spin text-accent" size={32} /></div>}>
            <CarouselSwipeCards
              items={filteredPlacements.map(placement => ({
                title: placement,
                image: 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=400',
                id: placement
              }))}
              selectedItem={selectedPlacement}
              onSelect={onSelectPlacement}
              basisSm="45%"
              basisMd="30%"
              basisLg="22%"
            />
          </Suspense>
        </CardContent>
      </Card>

      {/* Size Search Bar with Selection Chip */}
      <div className="space-y-3">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            type="text"
            placeholder="Search Sizes"
            value={sizeSearchQuery}
            onChange={(e) => setSizeSearchQuery(e.target.value)}
            className="pl-[40px] pr-[80px] h-20 bg-background/90 border-accent/50 focus-visible:border-accent focus-visible:ring-accent/50 !text-[20px] rounded-[8px] mt-12 mb-12 font-[Orbitron]"
          />
          {sizeSearchQuery && (
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
              {filteredSizes.length} result{filteredSizes.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        {selectedSize && (
          <div className="flex justify-center">
            <SelectionChip 
              label="Size"
              value={selectedSize}
              onClear={() => onSelectSize(null)}
            />
          </div>
        )}
      </div>

      {/* Size Carousel */}
      <Card className="relative overflow-hidden border-2 border-accent/20" style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        background: 'linear-gradient(90deg, hsla(0, 0%, 100%, 0.2), hsla(0, 0%, 100%, 0.05))',
        borderRadius: '70px',
        boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
      }}>
        <CardContent className="p-4 md:p-6">
          <h3 className="m-0 p-0 mb-1 flex items-center justify-center gap-2 text-[24px] font-[Orbitron] text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)', letterSpacing: '5px' }}>
            <Ruler size={24} />
            Size
          </h3>
          <Suspense fallback={<div className="flex items-center justify-center py-8"><Sparkles className="animate-spin text-accent" size={32} /></div>}>
            <CarouselSwipeCards
              items={filteredSizes.map(size => ({
                title: size,
                image: 'https://images.unsplash.com/photo-1565058379802-bbe93b2f703f?w=400',
                id: size
              }))}
              selectedItem={selectedSize}
              onSelect={onSelectSize}
              basisSm="45%"
              basisMd="30%"
              basisLg="22%"
            />
          </Suspense>
        </CardContent>
      </Card>

      {/* Color Search Bar with Selection Chip */}
      <div className="space-y-3">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            type="text"
            placeholder="Search Colors"
            value={colorSearchQuery}
            onChange={(e) => setColorSearchQuery(e.target.value)}
            className="pl-[40px] pr-[80px] h-20 bg-background/90 border-accent/50 focus-visible:border-accent focus-visible:ring-accent/50 !text-[20px] rounded-[8px] mt-12 mb-12 font-[Orbitron]"
          />
          {colorSearchQuery && (
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
              {filteredColors.length} result{filteredColors.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        {selectedColorPreference && (
          <div className="flex justify-center">
            <SelectionChip 
              label="Color"
              value={selectedColorPreference}
              onClear={() => onSelectColorPreference(null)}
            />
          </div>
        )}
      </div>

      {/* Color Preference Carousel */}
      <Card className="relative overflow-hidden border-2 border-accent/20" style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        background: 'linear-gradient(90deg, hsla(0, 0%, 100%, 0.2), hsla(0, 0%, 100%, 0.05))',
        borderRadius: '70px',
        boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
      }}>
        <CardContent className="p-4 md:p-6">
          <h3 className="m-0 p-0 mb-1 flex items-center justify-center gap-2 text-[24px] font-[Orbitron] text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)', letterSpacing: '5px' }}>
            <Palette size={24} />
            Color
          </h3>
          <Suspense fallback={<div className="flex items-center justify-center py-8"><Sparkles className="animate-spin text-accent" size={32} /></div>}>
            <CarouselSwipeCards
              items={filteredColors.map(color => ({
                title: color,
                image: 'https://images.unsplash.com/photo-1590246814883-57c511dd0ba4?w=400',
                id: color
              }))}
              selectedItem={selectedColorPreference}
              onSelect={onSelectColorPreference}
              basisSm="45%"
              basisMd="30%"
              basisLg="22%"
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}