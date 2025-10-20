import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card 
      className="border-2 hover:border-accent transition-all hover:shadow-lg hover:shadow-accent/10 rounded-[48px] aspect-square" 
      style={{ filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.6))' }}
    >
      <CardContent className="p-8 h-full flex flex-col justify-center gap-6">
        <div className="flex items-center gap-6">
          <div 
            className="w-20 h-20 min-w-20 min-h-20 bg-accent/20 border border-accent/30 rounded-lg flex items-center justify-center flex-shrink-0" 
            style={{ filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))' }}
          >
            <Icon 
              className="text-accent flex-shrink-0" 
              size={42} 
              style={{ width: '42px', height: '42px' }} 
            />
          </div>
          <h3 className="text-xl font-[Audiowide] text-[24px]">{title}</h3>
        </div>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
