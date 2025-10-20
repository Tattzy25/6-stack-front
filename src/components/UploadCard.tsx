import { useRef, useState } from 'react';
import { Upload, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { SaveChip } from './shared/SaveChip';
import { sessionDataStore } from '../services/submissionService';
import { useAuth } from '../contexts/AuthContext';
import { resizeImage, getImageDimensions } from '../utils/imageProcessor';

interface UploadedImage {
  file: File;
  preview: string;
  id: string;
}

interface UploadCardProps {
  generatorType?: string;
  onFileSelect?: (files: File[]) => void;
  maxFiles?: number;
  acceptedFormats?: string;
  maxFileSize?: string;
  uploadText?: string;
  uploadSubtext?: string;
  disabled?: boolean;
  className?: string;
}

export function UploadCard({
  generatorType,
  onFileSelect,
  maxFiles = 6,
  acceptedFormats = 'image/png,image/jpeg,image/jpg',
  maxFileSize = '10MB',
  uploadText = 'Click to upload or drag and drop',
  uploadSubtext,
  disabled = false,
  className = '',
}: UploadCardProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Determine if upload is required for this generator type
  const isUploadRequired = ['couples', 'coverup', 'extend'].includes(generatorType || '');
  
  // Validation
  const isValid = isUploadRequired ? uploadedImages.length > 0 : true;
  const errorMessage = 'MIN 1 IMAGE';

  const handleUploadClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const formatAcceptedFormats = () => {
    const formats = acceptedFormats.split(',').map(f => f.replace('image/', '').toUpperCase());
    return formats.join(', ');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxFiles - uploadedImages.length;
    if (remainingSlots <= 0) {
      toast.error(`Maximum ${maxFiles} images allowed`);
      return;
    }

    const validFiles: UploadedImage[] = [];
    const filesToProcess = Math.min(files.length, remainingSlots);

    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i];
      
      try {
        // Validate file size BEFORE processing
        const maxSizeInBytes = parseInt(maxFileSize.replace('MB', '')) * 1024 * 1024;
        if (file.size > maxSizeInBytes) {
          toast.error(`${file.name}: File too large (max ${maxFileSize})`);
          continue;
        }
        
        // Get original dimensions for info
        const { width, height } = await getImageDimensions(file);
        const needsResize = width > 1024 || height > 1024;
        
        // Auto-resize if needed (max 1024x1024, maintaining aspect ratio)
        const processedFile = needsResize 
          ? await resizeImage(file, { maxWidth: 1024, maxHeight: 1024, quality: 0.9 })
          : file;
        
        // Show toast if resized
        if (needsResize) {
          toast.success(`${file.name}: Resized from ${width}x${height}px to fit 1024x1024px`);
        }
        
        // Create preview URL and add to valid files
        const preview = URL.createObjectURL(processedFile);
        validFiles.push({
          file: processedFile,
          preview,
          id: `${Date.now()}-${i}-${Math.random()}`
        });
      } catch (error) {
        toast.error(`Failed to process ${file.name}`);
        continue;
      }
    }

    if (validFiles.length > 0) {
      const newImages = [...uploadedImages, ...validFiles];
      setUploadedImages(newImages);
      onFileSelect?.(newImages.map(img => img.file));
      
      // Only show general success if we didn't already show resize toasts
      const resizeCount = validFiles.length - validFiles.filter((_, i) => i < filesToProcess).length;
      if (resizeCount === 0) {
        toast.success(`${validFiles.length} image${validFiles.length > 1 ? 's' : ''} uploaded`);
      }
      
      // Reset submission state when new images are added
      if (isSubmitted) {
        setIsSubmitted(false);
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation(); // Prevent triggering lightbox
    setUploadedImages(prev => {
      const updated = prev.filter(img => img.id !== id);
      // Revoke object URL to free memory
      const removed = prev.find(img => img.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.preview);
      }
      onFileSelect?.(updated.map(img => img.file));
      
      // Reset submission state if images count changes
      if (isSubmitted && updated.length !== prev.length) {
        setIsSubmitted(false);
      }
      
      return updated;
    });
    setLightboxIndex(null); // Close lightbox if open
    toast.info('Image removed');
  };

  const handleSubmit = () => {
    if (!isValid) return;

    // Convert uploaded images to base64
    const imagePromises = uploadedImages.map(img => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(img.file);
      });
    });

    Promise.all(imagePromises).then(base64Images => {
      // Store in session based on generator type
      if (generatorType === 'couples') {
        sessionDataStore.setCouplesData(
          { referenceImages: base64Images },
          user?.id
        );
      } else if (generatorType === 'coverup') {
        sessionDataStore.setCoverUpData(
          { existingTattooImages: base64Images },
          user?.id
        );
      } else if (generatorType === 'extend') {
        sessionDataStore.setExtendData(
          { currentTattooImages: base64Images },
          user?.id
        );
      } else if (generatorType === 'freestyle') {
        sessionDataStore.setFreestyleData(
          { images: base64Images },
          user?.id
        );
      } else if (generatorType === 'tattty') {
        sessionDataStore.setSourceCardData(
          { images: base64Images },
          user?.id
        );
      }
      
      // Mark as submitted
      setIsSubmitted(true);
    });
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % uploadedImages.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + uploadedImages.length) % uploadedImages.length);
    }
  };

  const defaultSubtext = uploadSubtext || `Upload 1-${maxFiles} images (${formatAcceptedFormats()} max 1024x1024, up to ${maxFileSize} each)`;

  return (
    <Card 
      className={`relative overflow-hidden border-2 border-accent/20 ${className}`}
      style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        background: 'linear-gradient(90deg, hsla(0, 0%, 100%, 0.2), hsla(0, 0%, 100%, 0.05))',
        borderRadius: '40px',
        boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats}
        multiple={maxFiles > 1}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || uploadedImages.length >= maxFiles}
      />

      <div 
        onClick={handleUploadClick}
        className={`border-2 border-dashed border-accent/30 rounded-2xl p-6 md:p-8 text-center hover:border-accent/50 transition-colors ${disabled || uploadedImages.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <Upload className="mx-auto mb-2 text-accent" size={32} />
        {generatorType && (
          <p className="text-xs text-accent/70 mb-2 font-[Orbitron] tracking-wider">
            {isUploadRequired ? 'REQUIRED' : 'OPTIONAL'}
          </p>
        )}
        <p className="text-sm text-muted-foreground mb-1">
          {uploadText}
        </p>
        <p className="text-xs text-muted-foreground">
          {defaultSubtext}
        </p>
        {uploadedImages.length > 0 && (
          <p className="text-xs text-accent mt-2">
            {uploadedImages.length} / {maxFiles} images uploaded
          </p>
        )}
      </div>

      {/* Thumbnails Section - Extends card downward */}
      {uploadedImages.length > 0 && (
        <div className="p-4 border-t border-accent/20">
          <div className="grid grid-cols-3 gap-3">
            {uploadedImages.map((image, index) => (
              <div 
                key={image.id}
                className="relative group aspect-square rounded-lg overflow-hidden border border-accent/30 cursor-pointer hover:border-accent/60 transition-colors"
                onClick={() => openLightbox(index)}
              >
                <img 
                  src={image.preview}
                  alt="Uploaded"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={(e) => removeImage(image.id, e)}
                  className="absolute top-1 right-1 bg-destructive/90 hover:bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  title="Remove image"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Chip - Show only if generator type is provided */}
      {generatorType && (
        <div className="flex justify-center items-center p-4 border-t border-accent/20">
          <SaveChip 
            onSubmit={handleSubmit}
            isValid={isValid}
            isSubmitted={isSubmitted}
            errorMessage={errorMessage}
          />
        </div>
      )}

      {/* Lightbox Modal */}
      <Dialog open={lightboxIndex !== null} onOpenChange={closeLightbox}>
        <DialogContent 
          className="max-w-4xl w-full p-0 bg-background/95 border-2 border-accent/30"
          style={{
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
          aria-describedby={undefined}
        >
          <DialogTitle className="sr-only">
            Image Preview
          </DialogTitle>
          {lightboxIndex !== null && uploadedImages[lightboxIndex] && (
            <div className="relative">
              {/* Main Image */}
              <div className="flex items-center justify-center p-8">
                <img 
                  src={uploadedImages[lightboxIndex].preview}
                  alt={`Image ${lightboxIndex + 1}`}
                  className="max-h-[70vh] w-auto object-contain rounded-lg"
                />
              </div>

              {/* Navigation Controls */}
              {uploadedImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-accent/20 hover:bg-accent/40 text-accent rounded-full p-3 transition-colors backdrop-blur-sm"
                    title="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-accent/20 hover:bg-accent/40 text-accent rounded-full p-3 transition-colors backdrop-blur-sm"
                    title="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Image Counter & Delete */}
              <div className="absolute top-4 left-0 right-0 flex items-center justify-between px-4">
                <div className="bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full border border-accent/30">
                  <p className="text-sm text-accent">
                    {lightboxIndex + 1} / {uploadedImages.length}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(uploadedImages[lightboxIndex].id);
                  }}
                  className="bg-destructive/90 hover:bg-destructive text-white rounded-full p-2 transition-colors"
                  title="Delete image"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
