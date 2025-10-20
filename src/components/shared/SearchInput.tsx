import { Search } from 'lucide-react';
import { Input } from '../ui/input';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  showResultCount?: boolean;
  resultCount?: number;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search",
  className = "",
  showResultCount = false,
  resultCount = 0
}: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-[40px] pr-[80px] h-16 bg-background/90 border-accent/50 focus-visible:border-accent focus-visible:ring-accent/50 text-[16px] rounded-lg"
      />
      {showResultCount && value && (
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
          {resultCount} result{resultCount !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
}
