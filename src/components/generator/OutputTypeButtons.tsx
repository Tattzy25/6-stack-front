import { InkStrokeButton } from '../ui/InkStrokeButton';

interface OutputTypeButtonsProps {
  outputType: 'color' | 'stencil';
  onOutputTypeChange: (type: 'color' | 'stencil') => void;
}

export function OutputTypeButtons({ outputType, onOutputTypeChange }: OutputTypeButtonsProps) {
  return null;
}
