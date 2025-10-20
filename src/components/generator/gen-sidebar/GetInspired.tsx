import { useState } from 'react';
import { TattooGallery } from '../../shared/TattooGallery';

export function GetInspired() {
  const [displayCount, setDisplayCount] = useState(30);

  // Gallery inspiration images (30 images)
  const inspirationDesigns = [
    { id: '1', title: 'Black Design', image: 'https://images.unsplash.com/photo-1707562034099-d535ceb67a8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YXR0b28lMjBkZXNpZ24lMjBibGFja3xlbnwxfHx8fDE3NjA4MDA3NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: '2', title: 'Minimalist', image: 'https://images.unsplash.com/photo-1759346771288-ac905d1b1abf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwdGF0dG9vfGVufDF8fHx8MTc2MDcxNTg0OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: '3', title: 'Geometric', image: 'https://images.unsplash.com/photo-1604374376934-2df6fad6519b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW9tZXRyaWMlMjB0YXR0b298ZW58MXx8fHwxNzYwNzE1ODQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: '4', title: 'Traditional', image: 'https://images.unsplash.com/photo-1759806919529-7db386dd4741?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMHRhdHRvb3xlbnwxfHx8fDE3NjA3Nzc0Njl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: '5', title: 'Watercolor', image: 'https://images.unsplash.com/photo-1566975293313-34b1fd638bc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlcmNvbG9yJTIwdGF0dG9vfGVufDF8fHx8MTc2MDgwMDc0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: '6', title: 'Japanese', image: 'https://images.unsplash.com/photo-1597852075234-fd721ac361d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHRhdHRvb3xlbnwxfHx8fDE3NjA4MDA3NDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: '7', title: 'Tribal', image: 'https://images.unsplash.com/photo-1595118772604-edf07a80054e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmliYWwlMjB0YXR0b298ZW58MXx8fHwxNzYwODAxMTQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: '8', title: 'Floral', image: 'https://images.unsplash.com/photo-1596896734952-c4c1cd2efe0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9yYWwlMjB0YXR0b298ZW58MXx8fHwxNzYwNzIwMDQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: '9', title: 'Dragon', image: 'https://images.unsplash.com/photo-1721836300647-b70a83352c31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFnb24lMjB0YXR0b298ZW58MXx8fHwxNzYwNzc3NDcwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: '10', title: 'Skull', image: 'https://images.unsplash.com/photo-1545418742-191c52702f45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza3VsbCUyMHRhdHRvb3xlbnwxfHx8fDE3NjA4MDExNDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: '11', title: 'Rose', image: 'https://images.unsplash.com/photo-1592800919958-65678f3d80d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3NlJTIwdGF0dG9vfGVufDF8fHx8MTc2MDgwMTE0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: '12', title: 'Butterfly', image: 'https://images.unsplash.com/photo-1613545553204-2f699d26b75d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXR0ZXJmbHklMjB0YXR0b298ZW58MXx8fHwxNzYwODAxMTQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: '13', title: 'Wolf', image: 'https://images.unsplash.com/photo-1667809615247-582f1f418d8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b2xmJTIwdGF0dG9vfGVufDF8fHx8MTc2MDgwMTE0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: '14', title: 'Lion', image: 'https://images.unsplash.com/photo-1709094269206-cc77802ab4e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaW9uJTIwdGF0dG9vfGVufDF8fHx8MTc2MDgwMTE0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: '15', title: 'Snake', image: 'https://images.unsplash.com/photo-1635889096265-24e4efa72e42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmFrZSUyMHRhdHRvb3xlbnwxfHx8fDE3NjA4MDExNDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: '16', title: 'Phoenix', image: 'https://images.unsplash.com/photo-1667498235434-cdad5f6337ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG9lbml4JTIwdGF0dG9vfGVufDF8fHx8MTc2MDgwMTE0OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: '17', title: 'Mandala', image: 'https://images.unsplash.com/photo-1604374376934-2df6fad6519b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5kYWxhJTIwdGF0dG9vfGVufDF8fHx8MTc2MDgwMTE1MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: '18', title: 'Compass', image: 'https://images.unsplash.com/photo-1662753361921-e6784e43f88b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wYXNzJTIwdGF0dG9vfGVufDF8fHx8MTc2MDgwMTE1MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: '19', title: 'Anchor', image: 'https://images.unsplash.com/photo-1613332658633-551aef234b70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNob3IlMjB0YXR0b298ZW58MXx8fHwxNzYwODAxMTUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: '20', title: 'Feather', image: 'https://images.unsplash.com/photo-1759873821400-389aa110eeef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZWF0aGVyJTIwdGF0dG9vfGVufDF8fHx8MTc2MDgwMTE1MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: '21', title: 'Arrow', image: 'https://images.unsplash.com/photo-1588417490413-57973b627712?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnJvdyUyMHRhdHRvb3xlbnwxfHx8fDE3NjA4MDExNTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: '22', title: 'Moon', image: 'https://images.unsplash.com/photo-1676927769842-c59f570004b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb29uJTIwdGF0dG9vfGVufDF8fHx8MTc2MDgwMTE1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: '23', title: 'Star', image: 'https://images.unsplash.com/photo-1722625805918-6e11f6c7682d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFyJTIwdGF0dG9vfGVufDF8fHx8MTc2MDgwMTE1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: '24', title: 'Tree', image: 'https://images.unsplash.com/photo-1612965690978-26034d0cff11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVlJTIwdGF0dG9vfGVufDF8fHx8MTc2MDgwMTE1Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: '25', title: 'Mountain', image: 'https://images.unsplash.com/photo-1576904394143-8cfeacabde55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHRhdHRvb3xlbnwxfHx8fDE3NjA4MDExNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: '26', title: 'Wave', image: 'https://images.unsplash.com/photo-1597525189905-1e661eb3db61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXZlJTIwdGF0dG9vfGVufDF8fHx8MTc2MDgwMTE1Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: '27', title: 'Sun', image: 'https://images.unsplash.com/photo-1751891472859-9ac5b068864d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW4lMjB0YXR0b298ZW58MXx8fHwxNzYwODAxMTUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: '28', title: 'Crown', image: 'https://images.unsplash.com/photo-1659553653371-1c0a17aaa8b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm93biUyMHRhdHRvb3xlbnwxfHx8fDE3NjA4MDExNTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: '29', title: 'Heart', image: 'https://images.unsplash.com/photo-1704345911717-b9c422bf6ef0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFydCUyMHRhdHRvb3xlbnwxfHx8fDE3NjA4MDExNTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: '30', title: 'Wings', image: 'https://images.unsplash.com/photo-1571434305870-0621521af411?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5ncyUyMHRhdHRvb3xlbnwxfHx8fDE3NjA4MDExNTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  ];

  return (
    <div style={{ paddingTop: '100px' }}>
      <TattooGallery
        designs={inspirationDesigns}
        displayCount={displayCount}
        onLoadMore={() => setDisplayCount(prev => Math.min(prev + 10, inspirationDesigns.length))}
        hasMore={displayCount < inspirationDesigns.length}
        columns={2}
        title="GET INSPIRED"
      />
    </div>
  );
}
