import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { 
  Square, 
  Type, 
  Image as ImageIcon, 
  MessageSquare, 
  Layout,
  Circle,
  Sparkles,
  MousePointer2,
  Settings,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface EditorPanelProps {
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onAddComponent: (type: string) => void;
}

export function EditorPanel({ isEditMode, onToggleEditMode, onAddComponent }: EditorPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const components = [
    { type: 'card', label: 'Glass Card', icon: Square },
    { type: 'button', label: 'Button', icon: MousePointer2 },
    { type: 'input', label: 'Input Field', icon: Type },
    { type: 'textarea', label: 'Text Area', icon: MessageSquare },
    { type: 'image', label: 'Image', icon: ImageIcon },
    { type: 'badge', label: 'Badge', icon: Circle },
    { type: 'separator', label: 'Separator', icon: Layout },
    { type: 'icon', label: 'Icon', icon: Sparkles },
  ];

  return (
    <div 
      className="fixed top-24 right-6 z-50 transition-all duration-300"
      style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <Card 
        className="border-accent/30 shadow-2xl rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(87, 241, 214, 0.15), rgba(87, 241, 214, 0.05))',
        }}
      >
        {/* Header */}
        <div className="p-4 bg-accent/5 border-b border-accent/20">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-accent" />
              <span className="text-sm text-foreground">Page Editor</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="p-4 space-y-4 w-64">
            {/* Edit Mode Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-background/20 border border-accent/10">
              <Label htmlFor="edit-mode" className="text-sm cursor-pointer">
                Edit Mode
              </Label>
              <Switch
                id="edit-mode"
                checked={isEditMode}
                onCheckedChange={onToggleEditMode}
              />
            </div>

            {isEditMode && (
              <>
                <Separator className="bg-accent/10" />

                {/* Components Grid */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground px-1">
                    Click to add components
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {components.map((component) => {
                      const Icon = component.icon;
                      return (
                        <Button
                          key={component.type}
                          variant="outline"
                          className="h-auto py-3 px-2 flex flex-col items-center gap-2 border-accent/20 hover:border-accent/50 hover:bg-accent/10 transition-all"
                          onClick={() => onAddComponent(component.type)}
                        >
                          <Icon className="w-5 h-5 text-accent" />
                          <span className="text-xs">{component.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <Separator className="bg-accent/10" />

                {/* Instructions */}
                <div className="p-3 rounded-xl bg-accent/5 border border-accent/10">
                  <p className="text-xs text-muted-foreground">
                    💡 Drag to move, resize from corners
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
