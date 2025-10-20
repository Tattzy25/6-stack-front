import { useState, useRef, useEffect } from 'react';
import { Resizable } from 're-resizable';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Sparkles, X } from 'lucide-react';

interface DraggableComponentProps {
  id: string;
  type: string;
  position: { x: number; y: number };
  size?: { width: number; height: number };
  content: string;
  isEditMode: boolean;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onSizeChange: (id: string, size: { width: number; height: number }) => void;
  onContentChange: (id: string, content: string) => void;
  onRemove: (id: string) => void;
}

export function DraggableComponent({
  id,
  type,
  position,
  size = { width: 300, height: 200 },
  content,
  isEditMode,
  onPositionChange,
  onSizeChange,
  onContentChange,
  onRemove,
}: DraggableComponentProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    if ((e.target as HTMLElement).closest('.resize-handle')) return;

    setIsDragging(true);
    // Calculate offset from the current position
    setDragOffset({
      x: e.pageX - position.x,
      y: e.pageY - position.y,
    });
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Use pageX/pageY to account for scroll position
      const newX = e.pageX - dragOffset.x;
      const newY = e.pageY - dragOffset.y;
      
      // Clamp positions to prevent components from going off-screen
      const clampedX = Math.max(0, Math.min(newX, window.innerWidth - 100));
      const clampedY = Math.max(0, newY);
      
      onPositionChange(id, { x: clampedX, y: clampedY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, id, onPositionChange]);

  const renderComponent = () => {
    switch (type) {
      case 'card':
        return (
          <Card 
            className="w-full h-full border-accent/20 p-6 rounded-[40px]"
            style={{
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            }}
          >
            {isEditing ? (
              <input
                type="text"
                value={content}
                onChange={(e) => onContentChange(id, e.target.value)}
                onBlur={() => setIsEditing(false)}
                autoFocus
                className="bg-transparent border-none outline-none text-muted-foreground text-sm w-full"
              />
            ) : (
              <p 
                className="text-muted-foreground text-sm cursor-text"
                onClick={() => isEditMode && setIsEditing(true)}
              >
                {content}
              </p>
            )}
          </Card>
        );
      case 'button':
        return (
          <Button className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90">
            {isEditing ? (
              <input
                type="text"
                value={content}
                onChange={(e) => onContentChange(id, e.target.value)}
                onBlur={() => setIsEditing(false)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
                className="bg-transparent border-none outline-none text-center w-full"
              />
            ) : (
              <span 
                onClick={(e) => {
                  if (isEditMode) {
                    e.stopPropagation();
                    setIsEditing(true);
                  }
                }}
              >
                {content}
              </span>
            )}
          </Button>
        );
      case 'input':
        return (
          <Input 
            placeholder={content} 
            value={isEditing ? content : ''}
            onChange={(e) => isEditing && onContentChange(id, e.target.value)}
            onFocus={() => isEditMode && setIsEditing(true)}
            onBlur={() => setIsEditing(false)}
            className="w-full" 
          />
        );
      case 'textarea':
        return (
          <Textarea 
            placeholder={content}
            value={isEditing ? content : ''}
            onChange={(e) => isEditing && onContentChange(id, e.target.value)}
            onFocus={() => isEditMode && setIsEditing(true)}
            onBlur={() => setIsEditing(false)}
            className="w-full h-full min-h-[100px]" 
          />
        );
      case 'image':
        return (
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400&h=300&fit=crop"
            alt="Placeholder"
            className="w-full h-full object-cover rounded-xl"
          />
        );
      case 'badge':
        return (
          <Badge className="bg-accent text-accent-foreground">
            {isEditing ? (
              <input
                type="text"
                value={content}
                onChange={(e) => onContentChange(id, e.target.value)}
                onBlur={() => setIsEditing(false)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
                className="bg-transparent border-none outline-none text-center w-full"
              />
            ) : (
              <span 
                onClick={(e) => {
                  if (isEditMode) {
                    e.stopPropagation();
                    setIsEditing(true);
                  }
                }}
              >
                {content}
              </span>
            )}
          </Badge>
        );
      case 'separator':
        return (
          <Separator className="w-full bg-accent/20" />
        );
      case 'icon':
        return (
          <Sparkles className="w-12 h-12 text-accent" />
        );
      default:
        return <div className="w-full h-full bg-card/50 rounded-xl p-4">Unknown</div>;
    }
  };

  return (
    <div
      ref={componentRef}
      className="absolute"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isEditMode ? (isDragging ? 'grabbing' : 'grab') : 'default',
        zIndex: isDragging ? 100 : 10,
      }}
    >
      <Resizable
        size={size}
        onResizeStop={(e, direction, ref, d) => {
          onSizeChange(id, {
            width: size.width + d.width,
            height: size.height + d.height,
          });
        }}
        enable={isEditMode ? {
          top: true,
          right: true,
          bottom: true,
          left: true,
          topRight: true,
          bottomRight: true,
          bottomLeft: true,
          topLeft: true,
        } : false}
        minWidth={100}
        minHeight={40}
      >
        <div
          className={`w-full h-full relative ${isEditMode ? 'ring-2 ring-accent/30 rounded-xl' : ''}`}
          onMouseDown={handleMouseDown}
        >
          {renderComponent()}
          
          {isEditMode && (
            <Button
              variant="destructive"
              size="sm"
              className="absolute -top-3 -right-3 h-7 w-7 p-0 rounded-full shadow-lg"
              onClick={() => onRemove(id)}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </Resizable>
    </div>
  );
}