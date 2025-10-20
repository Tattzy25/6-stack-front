import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../ui/dialog';
import { 
  Edit3, 
  Upload, 
  Image as ImageIcon, 
  Wand2, 
  Calendar,
  Trash2,
  Download,
  Eye,
  Sparkles,
  Palette
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface EditedImage {
  id: string;
  originalImage: string;
  editedImage: string;
  title: string;
  metadata: {
    brightness: number;
    contrast: number;
    saturation: number;
    rotation: number;
    zoom: number;
    outputType: 'color' | 'stencil';
    editedAt: string;
  };
  createdAt: string;
}

export function EditsTab() {
  const [edits, setEdits] = useState<EditedImage[]>([
    {
      id: '1',
      originalImage: 'https://images.unsplash.com/photo-1565058379802-bbe93b2f703f?w=400',
      editedImage: 'https://images.unsplash.com/photo-1565058379802-bbe93b2f703f?w=400',
      title: 'Dragon Tattoo Edit',
      metadata: {
        brightness: 110,
        contrast: 120,
        saturation: 90,
        rotation: 0,
        zoom: 100,
        outputType: 'stencil',
        editedAt: new Date().toISOString()
      },
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: '2',
      originalImage: 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=400',
      editedImage: 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=400',
      title: 'Phoenix Design Enhanced',
      metadata: {
        brightness: 100,
        contrast: 130,
        saturation: 110,
        rotation: 15,
        zoom: 100,
        outputType: 'color',
        editedAt: new Date().toISOString()
      },
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ]);

  const [selectedEdit, setSelectedEdit] = useState<EditedImage | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingImage, setEditingImage] = useState<string | null>(null);

  const handleCreateNew = () => {
    setEditingImage(null);
    setShowEditor(true);
  };

  const handleEditExisting = (edit: EditedImage) => {
    setEditingImage(edit.editedImage);
    setShowEditor(true);
  };

  const handleSaveEdit = (editedImage: string, metadata: any) => {
    const newEdit: EditedImage = {
      id: Date.now().toString(),
      originalImage: editingImage || '',
      editedImage,
      title: `Edit ${new Date().toLocaleDateString()}`,
      metadata,
      createdAt: new Date().toISOString()
    };

    setEdits([newEdit, ...edits]);
    setShowEditor(false);
    toast.success('Edit saved to your dashboard!');
  };

  const handleDelete = (id: string) => {
    setEdits(edits.filter(edit => edit.id !== id));
    toast.success('Edit deleted');
  };

  const handleDownload = (imageUrl: string, title: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${title.replace(/\s+/g, '-')}.png`;
    link.click();
    toast.success('Image downloaded!');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 font-[Orbitron]">
            <Edit3 className="text-primary" />
            Image Editor
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Edit your generated designs or upload new images to customize
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Upload className="mr-2" size={16} />
          New Edit
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ImageIcon className="text-primary" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold">{edits.length}</div>
                <div className="text-xs text-muted-foreground">Total Edits</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Palette className="text-blue-400" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {edits.filter(e => e.metadata.outputType === 'color').length}
                </div>
                <div className="text-xs text-muted-foreground">Color Designs</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Wand2 className="text-purple-400" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {edits.filter(e => e.metadata.outputType === 'stencil').length}
                </div>
                <div className="text-xs text-muted-foreground">Stencils</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Edits</TabsTrigger>
          <TabsTrigger value="color">Color</TabsTrigger>
          <TabsTrigger value="stencil">Stencil</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <EditGrid 
            edits={edits} 
            onEdit={handleEditExisting}
            onDelete={handleDelete}
            onDownload={handleDownload}
            onView={setSelectedEdit}
          />
        </TabsContent>

        <TabsContent value="color" className="mt-6">
          <EditGrid 
            edits={edits.filter(e => e.metadata.outputType === 'color')} 
            onEdit={handleEditExisting}
            onDelete={handleDelete}
            onDownload={handleDownload}
            onView={setSelectedEdit}
          />
        </TabsContent>

        <TabsContent value="stencil" className="mt-6">
          <EditGrid 
            edits={edits.filter(e => e.metadata.outputType === 'stencil')} 
            onEdit={handleEditExisting}
            onDelete={handleDelete}
            onDownload={handleDownload}
            onView={setSelectedEdit}
          />
        </TabsContent>
      </Tabs>

      {/* Editor Dialog */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-[Orbitron]">
              <Sparkles className="text-primary" />
              Image Editor
            </DialogTitle>
            <DialogDescription>
              Upload and customize your tattoo design
            </DialogDescription>
          </DialogHeader>
          
          {/* Placeholder for Image Editor - Coming Soon */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-12">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl">Advanced Image Editor</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Our powerful image editing tools are currently in development. Soon you'll be able to adjust brightness, contrast, saturation, rotation, and convert your designs to color or stencil formats.
                  </p>
                  <div className="pt-4 space-y-2">
                    <p className="text-sm font-medium">Coming Features:</p>
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground max-w-md mx-auto">
                      <div>✓ Brightness & Contrast</div>
                      <div>✓ Color Adjustments</div>
                      <div>✓ Rotation & Crop</div>
                      <div>✓ Stencil Conversion</div>
                      <div>✓ Filters & Effects</div>
                      <div>✓ Layer Management</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowEditor(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!selectedEdit} onOpenChange={() => setSelectedEdit(null)}>
        <DialogContent className="max-w-3xl">
          {selectedEdit && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedEdit.title}</DialogTitle>
                <DialogDescription>
                  Created {formatDate(selectedEdit.createdAt)}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <img
                  src={selectedEdit.editedImage}
                  alt={selectedEdit.title}
                  className="w-full rounded-lg border border-border"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium mb-2">Settings</div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div>Brightness: {selectedEdit.metadata.brightness}%</div>
                      <div>Contrast: {selectedEdit.metadata.contrast}%</div>
                      <div>Saturation: {selectedEdit.metadata.saturation}%</div>
                      <div>Rotation: {selectedEdit.metadata.rotation}°</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-2">Output Type</div>
                    <Badge variant={selectedEdit.metadata.outputType === 'color' ? 'default' : 'outline'}>
                      {selectedEdit.metadata.outputType === 'color' ? 'Full Color' : 'Stencil/Sketch'}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleDownload(selectedEdit.editedImage, selectedEdit.title)}
                  >
                    <Download className="mr-2" size={16} />
                    Download
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      setSelectedEdit(null);
                      handleEditExisting(selectedEdit);
                    }}
                  >
                    <Edit3 className="mr-2" size={16} />
                    Edit Again
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Edit Grid Component
function EditGrid({ 
  edits, 
  onEdit, 
  onDelete, 
  onDownload,
  onView 
}: { 
  edits: EditedImage[];
  onEdit: (edit: EditedImage) => void;
  onDelete: (id: string) => void;
  onDownload: (imageUrl: string, title: string) => void;
  onView: (edit: EditedImage) => void;
}) {
  if (edits.length === 0) {
    return (
      <Card>
        <CardContent className="p-12">
          <div className="text-center">
            <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No edits yet</h3>
            <p className="text-sm text-muted-foreground">
              Upload an image or select a design from your dashboard to start editing
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {edits.map((edit) => (
        <Card key={edit.id} className="group overflow-hidden">
          <div className="aspect-square relative overflow-hidden bg-secondary">
            <img
              src={edit.editedImage}
              alt={edit.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => onView(edit)}
                >
                  <Eye className="mr-1" size={14} />
                  View
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onEdit(edit)}
                >
                  <Edit3 size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onDownload(edit.editedImage, edit.title)}
                >
                  <Download size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(edit.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-medium text-sm line-clamp-1">{edit.title}</h3>
              <Badge variant={edit.metadata.outputType === 'color' ? 'default' : 'outline'} className="text-xs">
                {edit.metadata.outputType === 'color' ? 'Color' : 'Stencil'}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar size={12} />
              {new Date(edit.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
