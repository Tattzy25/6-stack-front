import { Search, Filter, Grid3x3, List, Eye, Download, Share2, Trash2, Clock, Heart, Sparkles } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Separator } from '../../ui/separator';

interface Design {
  id: number;
  title: string;
  category: string;
  date: string;
  likes: number;
  imageUrl: string;
  status: string;
}

interface DesignsTabProps {
  designs: Design[];
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function DesignsTab({ designs, viewMode, onViewModeChange }: DesignsTabProps) {
  // Show empty state if no designs
  if (designs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-6 bg-accent/10 rounded-full mb-6">
          <Sparkles className="text-accent" size={48} />
        </div>
        <h3 className="text-2xl mb-3">No designs yet</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Start creating your first AI-powered tattoo design. Your creations will appear here.
        </p>
        <Button onClick={() => window.scrollTo(0, 0)} className="bg-accent hover:bg-accent/90">
          <Sparkles className="mr-2" size={16} />
          Create Your First Design
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search your designs..."
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2" size={14} />
            Filter
          </Button>
          <Separator orientation="vertical" className="h-8" />
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            className="px-3"
            onClick={() => onViewModeChange('grid')}
          >
            <Grid3x3 size={16} />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            className="px-3"
            onClick={() => onViewModeChange('list')}
          >
            <List size={16} />
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map((design) => (
            <Card key={design.id} className="group border-border/50 hover:border-accent/50 transition-all overflow-hidden">
              <div className="relative aspect-square bg-muted/30">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="text-muted-foreground" size={48} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="sm" variant="secondary">
                    <Eye className="mr-2" size={14} />
                    View
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Download size={14} />
                  </Button>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">{design.title}</CardTitle>
                    <Badge variant="secondary" className="mt-2">
                      {design.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{design.date}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 hover:text-accent transition-colors">
                      <Heart size={14} />
                      <span>{design.likes}</span>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {designs.map((design) => (
            <Card key={design.id} className="border-border/50 hover:border-accent/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-muted/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="text-muted-foreground" size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="mb-1">{design.title}</h4>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Badge variant="secondary">{design.category}</Badge>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{design.date}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Heart size={14} />
                        <span>{design.likes} likes</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button size="sm" variant="ghost">
                      <Eye className="mr-2" size={14} />
                      View
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Download size={14} />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Share2 size={14} />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
