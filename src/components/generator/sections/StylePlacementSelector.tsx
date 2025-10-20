import { Brush, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';

interface StylePlacementSelectorProps {
  styles: string[];
  placements: string[];
  selectedStyle: string | null;
  selectedPlacement: string | null;
  onSelectStyle: (style: string | null) => void;
  onSelectPlacement: (placement: string | null) => void;
}

export function StylePlacementSelector({
  styles,
  placements,
  selectedStyle,
  selectedPlacement,
  onSelectStyle,
  onSelectPlacement
}: StylePlacementSelectorProps) {
  return (
    <>
      {/* Style Selector */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl font-[Orbitron]">
            <Brush size={18} className="md:w-5 md:h-5" />
            Pick a Style
          </CardTitle>
          <CardDescription className="text-sm">
            Choose from popular tattoo art styles
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-wrap gap-2 md:gap-3">
            {styles.map((style) => {
              const isSelected = selectedStyle === style;
              return (
                <Badge
                  key={style}
                  variant={isSelected ? 'default' : 'outline'}
                  className={`cursor-pointer px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm transition-all duration-200 ${
                    isSelected
                      ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/20'
                      : 'hover:border-accent/50 hover:bg-accent/5'
                  }`}
                  onClick={() => onSelectStyle(isSelected ? null : style)}
                >
                  {style}
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Placement Selector */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl font-[Orbitron]">
            <MapPin size={18} className="md:w-5 md:h-5" />
            Body Placement
          </CardTitle>
          <CardDescription className="text-sm">
            Where will it be placed?
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-wrap gap-2 md:gap-3">
            {placements.map((placement) => {
              const isSelected = selectedPlacement === placement;
              return (
                <Badge
                  key={placement}
                  variant={isSelected ? 'default' : 'outline'}
                  className={`cursor-pointer px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm transition-all duration-200 ${
                    isSelected
                      ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/20'
                      : 'hover:border-accent/50 hover:bg-accent/5'
                  }`}
                  onClick={() => onSelectPlacement(isSelected ? null : placement)}
                >
                  {placement}
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
