import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface TestimonialCardProps {
  name: string;
  location: string;
  rating: number;
  text: string;
  avatar: string;
}

export function TestimonialCard({ name, location, rating, text, avatar }: TestimonialCardProps) {
  return (
    <Card data-editable="true">
      <CardContent className="p-5 md:p-6 space-y-4">
        <div className="flex items-center gap-1 text-yellow-500">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} size={16} fill="currentColor" />
          ))}
        </div>
        <Quote size={32} className="text-accent opacity-50" />
        <p className="text-muted-foreground">{text}</p>
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <ImageWithFallback
            src={avatar}
            alt={name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="text-sm">{name}</p>
            <p className="text-xs text-muted-foreground">{location}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
