import { InkStrokeButton } from '../ui/InkStrokeButton';

interface BlackButtonProps {
  label?: string;
  onClick?: () => void;
  isActive?: boolean;
  className?: string;
}

export function BlackButton({ label = "BLACK", onClick, isActive = false, className = '' }: BlackButtonProps) {
  return (
    <InkStrokeButton
      label={label}
      isActive={isActive}
      onClick={onClick}
      className={className}
    />
  );
}
