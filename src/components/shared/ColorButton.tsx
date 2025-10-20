import { InkStrokeButton } from '../ui/InkStrokeButton';

interface ColorButtonProps {
  label?: string;
  onClick?: () => void;
  isActive?: boolean;
  className?: string;
}

export function ColorButton({ label = "COLOR", onClick, isActive = false, className = '' }: ColorButtonProps) {
  return (
    <InkStrokeButton
      label={label}
      isActive={isActive}
      onClick={onClick}
      className={className}
    />
  );
}
