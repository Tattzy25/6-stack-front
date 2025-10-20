import { Sparkle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Mood } from './moodData';

interface MoodSelectorProps {
  moods: Mood[];
  selectedMood: string | null;
  onSelectMood: (moodId: string | null) => void;
  title?: string;
}

export function MoodSelector({ 
  moods, 
  selectedMood, 
  onSelectMood,
  title = "Set Your Mood"
}: MoodSelectorProps) {
  return (
    <Card className="relative overflow-hidden border-2 border-accent/20" style={{
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      background: 'linear-gradient(90deg, hsla(0, 0%, 100%, 0.2), hsla(0, 0%, 100%, 0.05))',
      borderRadius: '70px',
      boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
    }}>
      <CardHeader className="md:p-6 pb-[0px] pt-[24px] pr-[24px] pl-[24px]">
        <CardTitle className="flex items-center justify-center gap-2 text-[24px] font-[Orbitron] text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)', letterSpacing: '5px' }}>
          <Sparkle size={24} />
          Set your Mood & Theme
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="grid grid-cols-4 gap-2 md:gap-3 lg:gap-4">
          {moods.map((mood) => {
            const MoodIcon = mood.icon;
            const isSelected = selectedMood === mood.id;
            return (
              <button
                key={mood.id}
                onClick={() => onSelectMood(isSelected ? null : mood.id)}
                className={`flex flex-col items-center justify-center gap-1.5 md:gap-2 p-2 md:p-3 lg:p-4 rounded-xl md:rounded-2xl aspect-square transition-all duration-200 border-2 ${
                  isSelected
                    ? 'border-accent bg-accent/10 shadow-lg shadow-accent/20'
                    : 'border-border/50 bg-background/50 hover:border-accent/50 hover:bg-accent/5'
                }`}
                style={{
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                }}
              >
                <MoodIcon 
                  className={`transition-colors ${
                    isSelected ? 'text-accent' : 'text-muted-foreground'
                  }`}
                  style={{ width: 'clamp(24px, 5vw, 36px)', height: 'clamp(24px, 5vw, 36px)' }}
                />
                <span className={`text-xs md:text-sm text-center transition-colors leading-tight ${
                  isSelected ? 'text-accent' : 'text-muted-foreground'
                }`}
                style={{ fontSize: 'clamp(10px, 1.8vw, 14px)' }}
                >
                  {mood.label}
                </span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
