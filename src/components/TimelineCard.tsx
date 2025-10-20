import { Card, CardContent } from './ui/card';

interface TimelineCardProps {
  title: string;
  description: string;
}

export function TimelineCard({ title, description }: TimelineCardProps) {
  return (
    <Card className="max-w-md">
      <CardContent className="p-6">
        <h3 className="text-xl mb-2 font-[Rock_Salt] text-left">{title}</h3>
        <p className="text-muted-foreground text-[20px] text-left font-normal">{description}</p>
      </CardContent>
    </Card>
  );
}
