import { Search } from 'lucide-react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

type FilterType = 'style' | 'color' | 'size' | 'vibe';

interface SearchFilterPanelProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilters: Record<FilterType, string | null>;
  onToggleFilter: (category: FilterType, value: string) => void;
  onClearAll: () => void;
}

export function SearchFilterPanel({
  searchQuery,
  onSearchChange,
  activeFilters,
  onToggleFilter,
  onClearAll,
}: SearchFilterPanelProps) {
  const filterOptions = {
    style: ['Traditional', 'Realism', 'Watercolor', 'Minimalist', 'Geometric', 'Japanese'],
    color: ['Black & Grey', 'Color', 'Blackwork'],
    size: ['Small', 'Medium', 'Large'],
    vibe: ['Dark', 'Bright', 'Weird', 'Classic'],
  };

  const hasActiveFilters = Object.values(activeFilters).some(v => v !== null) || searchQuery.length > 0;

  return (
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
            onChange={(e) => onSearchChange(e.target.value)}
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
                onClick={() => onToggleFilter('style', option)}
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
                onClick={() => onToggleFilter('color', option)}
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
                onClick={() => onToggleFilter('size', option)}
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
                onClick={() => onToggleFilter('vibe', option)}
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
              onClick={onClearAll}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
