import { Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Slider } from '../../ui/slider';

// Monk Scale inspired skintone palette - arranged lightest to darkest
const SKINTONE_PALETTE = [
  '#F7EDE4', // Very Light/Porcelain
  '#F3E7DA', // Light Beige
  '#F6EAD0', // Light Golden
  '#EAD9BB', // Medium Light
  '#D7BD96', // Medium Tan
  '#9F7D54', // Medium Bronze
  '#815D44', // Medium Dark
  '#604234', // Dark Brown
  '#3A312A', // Very Dark
  '#2A2420', // Deepest Brown/Black
];

// Convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

// Convert RGB to hex
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// Interpolate between two colors
function interpolateColor(color1: string, color2: string, factor: number): string {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  
  const r = c1.r + factor * (c2.r - c1.r);
  const g = c1.g + factor * (c2.g - c1.g);
  const b = c1.b + factor * (c2.b - c1.b);
  
  return rgbToHex(r, g, b);
}

// Get interpolated color from slider value (0-100)
function getColorFromValue(value: number): string {
  // Normalize value to 0-1 range
  const normalized = value / 100;
  
  // Calculate which two colors we're between
  const scaledValue = normalized * (SKINTONE_PALETTE.length - 1);
  const index = Math.floor(scaledValue);
  const factor = scaledValue - index;
  
  // Handle edge cases
  if (index >= SKINTONE_PALETTE.length - 1) {
    return SKINTONE_PALETTE[SKINTONE_PALETTE.length - 1];
  }
  
  // Interpolate between the two colors
  return interpolateColor(SKINTONE_PALETTE[index], SKINTONE_PALETTE[index + 1], factor);
}

interface SkintonePickerProps {
  selectedSkintone: number; // 0-100 value
  onSelectSkintone: (value: number) => void;
  title?: string;
}

export function SkintonePicker({ 
  selectedSkintone, 
  onSelectSkintone,
  title = "Choose Your Skintone"
}: SkintonePickerProps) {
  const currentColor = getColorFromValue(selectedSkintone);

  return (
    <Card className="relative overflow-hidden border-2 transition-all duration-500" 
      style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        background: `linear-gradient(135deg, ${currentColor}20, ${currentColor}05)`,
        borderColor: `${currentColor}40`,
        borderRadius: '70px',
        boxShadow: `0 0 40px ${currentColor}30, 0 0 60px rgba(0, 0, 0, 0.8)`
      }}>
      <CardHeader className="p-4 md:p-6 pb-3 md:pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-xl md:text-2xl font-[Orbitron] text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)', letterSpacing: '3px md:5px' }}>
          <Palette size={20} className="md:w-6 md:h-6" />
          <span className="text-base md:text-2xl">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-2 md:pt-3">
        <div className="space-y-4 md:space-y-6">
          {/* Current Selection Display */}
          <div className="flex items-center justify-center">
            <div 
              className="w-16 h-16 md:w-20 md:h-20 rounded-full border-3 md:border-4 border-accent shadow-lg transition-all duration-300"
              style={{ 
                backgroundColor: currentColor,
                boxShadow: `0 0 20px ${currentColor}60, 0 0 40px ${currentColor}30`
              }}
            />
          </div>

          {/* Continuous Skintone Slider */}
          <div className="space-y-3 md:space-y-4 px-1 md:px-2">
            <Slider
              value={[selectedSkintone]}
              onValueChange={(values) => onSelectSkintone(values[0])}
              min={0}
              max={100}
              step={0.1}
              className="cursor-pointer"
            />
            
            {/* Visual Palette Guide - No Labels */}
            <div className="relative h-6 md:h-8 rounded-full overflow-hidden border-2 border-border/30">
              {/* Gradient background showing full range */}
              <div 
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to right, ${SKINTONE_PALETTE.join(', ')})`
                }}
              />
              
              {/* Current position indicator */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-accent shadow-lg transition-all duration-150"
                style={{ 
                  left: `${selectedSkintone}%`,
                  boxShadow: '0 0 10px rgba(87, 241, 214, 0.8), 0 0 20px rgba(87, 241, 214, 0.4)'
                }}
              />
            </div>

            {/* Clickable palette stops for quick selection */}
            <div className="flex justify-between items-center gap-1">
              {SKINTONE_PALETTE.map((color, index) => {
                const stopValue = (index / (SKINTONE_PALETTE.length - 1)) * 100;
                const isNearCurrent = Math.abs(selectedSkintone - stopValue) < 5;
                
                return (
                  <button
                    key={index}
                    onClick={() => onSelectSkintone(stopValue)}
                    className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 transition-all duration-200 flex-shrink-0 ${
                      isNearCurrent
                        ? 'border-accent scale-110 md:scale-125 shadow-lg'
                        : 'border-border/30 hover:border-accent/50 hover:scale-105 md:hover:scale-110'
                    }`}
                    style={{ 
                      backgroundColor: color,
                      boxShadow: isNearCurrent 
                        ? `0 0 12px ${color}60` 
                        : 'none'
                    }}
                    aria-label={`Skintone ${index + 1}`}
                  />
                );
              })}
            </div>
          </div>


        </div>
      </CardContent>
    </Card>
  );
}

// Export for use in other components
export { SKINTONE_PALETTE, getColorFromValue };
