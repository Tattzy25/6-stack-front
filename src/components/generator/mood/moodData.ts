import { 
  Smile, 
  Moon, 
  Waves, 
  Zap, 
  HeartHandshake, 
  Sparkle, 
  Flame, 
  Minus,
  LucideIcon
} from 'lucide-react';

export interface Mood {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const moods: Mood[] = [
  { id: 'happy', label: 'Happy', icon: Smile },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'calm', label: 'Calm', icon: Waves },
  { id: 'bold', label: 'Bold', icon: Zap },
  { id: 'romantic', label: 'Romantic', icon: HeartHandshake },
  { id: 'spiritual', label: 'Spiritual', icon: Sparkle },
  { id: 'energetic', label: 'Energetic', icon: Flame },
  { id: 'minimalist', label: 'Minimalist', icon: Minus },
  { id: 'mysterious', label: 'Mysterious', icon: Moon },
  { id: 'playful', label: 'Playful', icon: Smile },
  { id: 'fierce', label: 'Fierce', icon: Flame },
  { id: 'peaceful', label: 'Peaceful', icon: Waves },
];
