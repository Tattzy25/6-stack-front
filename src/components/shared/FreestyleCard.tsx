import { useState, useRef, useEffect } from 'react';
import { Sparkles, Upload, X, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { HalftoneReveal } from '../generator/HalftoneReveal';
import { AskTaTTTy } from './AskTaTTTy';
import { SaveChip } from './SaveChip';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { DiamondLoader } from './DiamondLoader';
import { toast } from 'sonner';
import { sessionDataStore } from '../../services/submissionService';
import { useAuth } from '../../contexts/AuthContext';
import { env } from '../../utils/env';

const MIN_CHARACTERS = 50;

interface FreestyleCardProps {
  title?: string;
  showUpload?: boolean; // Only show upload on landing page
  onTextChange?: (text: string) => void;
  onImagesChange?: (files: File[]) => void;
  onSubmitted?: (isSubmitted: boolean) => void; // Callback when user clicks SUBMIT
  onNavigate?: (page: string) => void; // Navigation for InK uP flow
  mode?: 'freestyle' | 'brainstorm'; // Add mode for different behaviors
  personaId?: string; // Which AI persona to use (brainstorm, refine, vibe, critique)
  initialText?: string; // Initial text value for restoring saved data
  initialImages?: File[]; // Initial images for restoring saved data
}

export function FreestyleCard({ 
  title = 'Freestyle Imagination',
  showUpload = false,
  onTextChange,
  onImagesChange,
  onSubmitted,
  onNavigate,
  mode = 'freestyle',
  personaId = 'brainstorm',
  initialText = '',
  initialImages = [],
}: FreestyleCardProps) {
  const { user } = useAuth();
  const [showFreestyleSplash, setShowFreestyleSplash] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [text, setText] = useState(initialText);
  const [uploadedImages, setUploadedImages] = useState<File[]>(initialImages);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isAskTaTTTyLoading, setIsAskTaTTTyLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Brainstorm mode: chat interface with message history
  const [brainstormInput, setBrainstormInput] = useState('');
  const [brainstormError, setBrainstormError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string, images?: File[]}>>([]);
  const [brainstormImages, setBrainstormImages] = useState<File[]>([]); // Separate images for brainstorm mode

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (mode === 'brainstorm' && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, mode]);

  // Validation check for chip button
  const isValid = text.trim().length >= MIN_CHARACTERS;
  const errorMessage = 'MIN 50 CHAR';

  const handleButtonClick = () => {
    setIsRevealing(true);
  };

  const handleRevealComplete = () => {
    setShowFreestyleSplash(false);
  };

  // Typewriter effect helper
  const typewriterEffect = async (finalText: string) => {
    setText(''); // Clear first
    const chars = finalText.split('');
    for (let i = 0; i < chars.length; i++) {
      const currentText = chars.slice(0, i + 1).join('');
      setText(currentText);
      onTextChange?.(currentText);
      // Delay between characters (adjust for speed)
      await new Promise(resolve => setTimeout(resolve, 20));
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onTextChange?.(newText);
    // Clear validation error when user starts typing
    if (showValidationError && newText.trim()) {
      setShowValidationError(false);
    }
    // Reset submission state when text changes
    if (isSubmitted && newText.trim().length < MIN_CHARACTERS) {
      setIsSubmitted(false);
      onSubmitted?.(false);
    }
  };

  const handleSubmit = () => {
    if (mode === 'brainstorm') {
      // Brainstorm mode: validate messages exist
      if (messages.length === 0) {
        toast.error('Chat with TaTTTy first!');
        return;
      }
      
      // Get the full conversation as text
      const conversationText = messages
        .map(msg => `${msg.role === 'user' ? 'You' : 'TaTTTy'}: ${msg.content}`)
        .join('\n\n');
      
      // Get last AI response as the refined idea
      const lastAIMessage = messages.filter(m => m.role === 'assistant').pop();
      
      // Store brainstorm data (full conversation + last AI response)
      sessionDataStore.setSourceCardData(
        { 
          questionOne: conversationText, 
          questionTwo: lastAIMessage?.content || '' 
        }, 
        user?.id
      );
      sessionDataStore.setGeneratorType('brainstorm', user?.id);
      setIsSubmitted(true);
      onSubmitted?.(true);
      return;
    }
    
    // Freestyle mode: validate and save
    if (!isValid) return;

    const imagePromises = uploadedImages.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(base64Images => {
      sessionDataStore.setFreestyleData(
        { 
          prompt: text.trim(),
          images: base64Images.length > 0 ? base64Images : undefined
        },
        user?.id
      );
      
      setIsSubmitted(true);
      onSubmitted?.(true);
    });
  };

  const handleBrainstormSend = async () => {
    // BRAINSTORM MODE: Chat with full conversation history
    const userInput = brainstormInput.trim();
    
    // Validation: require text if images are present
    if (!userInput && brainstormImages.length > 0) {
      toast.error('Please add text with your images');
      return;
    }
    
    if (!userInput) {
      toast.error('Type your idea first!');
      return;
    }
    
    // Add user message to chat (with images if present)
    const userMessage = { 
      role: 'user' as const, 
      content: userInput,
      images: brainstormImages.length > 0 ? [...brainstormImages] : undefined
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setBrainstormInput(''); // Clear input immediately
    setBrainstormImages([]); // Clear images after sending
    
    setBrainstormError(null);
    setIsAskTaTTTyLoading(true);
    setShowLoader(true);
    
    try {
      const response = await fetch(`${env.apiBaseUrl}/api/groq/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
          personaId, // Send which persona to use (NO HARDCODING)
          personaType: mode === 'brainstorm' ? 'brainstorm' : 'chat', // Which persona file to use
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let accumulatedText = '';
      
      // Add empty assistant message that we'll fill with streaming
      setMessages([...updatedMessages, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.token) {
                accumulatedText += data.token;
                // Update the last message (assistant) with streaming text
                setMessages([...updatedMessages, { role: 'assistant', content: accumulatedText }]);
              }
              
              if (data.done) {
                setShowLoader(false);
                setIsAskTaTTTyLoading(false);
                return;
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      setShowLoader(false);
      setIsAskTaTTTyLoading(false);
    } catch (error) {
      setShowLoader(false);
      setIsAskTaTTTyLoading(false);
      toast.error('AI error. Try again.');
      console.error('Brainstorm error:', error);
      // Remove the empty assistant message on error
      setMessages(updatedMessages);
    }
  };

  const handleOptimize = async () => {
    // FREESTYLE MODE ONLY: Simple optimization (original behavior)
    const optimized = text.trim();
    if (!optimized) {
      setShowValidationError(true);
      setTimeout(() => setShowValidationError(false), 3000);
      return;
    }
    
    setShowValidationError(false);
    setIsAskTaTTTyLoading(true);
    setShowLoader(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const cleaned = optimized.charAt(0).toUpperCase() + optimized.slice(1);
    const finalText = cleaned.endsWith('.') ? cleaned : cleaned + '.';
    
    setShowLoader(false);
    setIsAskTaTTTyLoading(false);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await typewriterEffect(finalText);
    
    toast.success('Text optimized!');
  };

  const handleIdeas = async () => {
    // Button shows "Thinking..." + Loader starts immediately
    setIsAskTaTTTyLoading(true);
    setShowLoader(true);
    
    // Animation runs for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simple idea suggestion for landing page - populates textarea directly
    const ideas = [
      'A minimalist phoenix rising from ashes on your forearm. Bold black lines with vibrant color accents.',
      'Japanese koi fish swimming up your spine with cherry blossoms. Traditional irezumi style.',
      'Geometric mandala design on your shoulder blade. Sacred geometry with fine linework.',
      'Watercolor dreamscape sleeve with abstract shapes bleeding into nature elements.',
      'Neo-traditional wolf portrait on your chest. Hyper-realistic with bold traditional elements.',
    ];
    
    const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
    
    // Stop both loader and thinking state together
    setShowLoader(false);
    setIsAskTaTTTyLoading(false);
    
    // Small delay to let fade complete, then typewriter
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Typewriter effect for the idea
    await typewriterEffect(randomIdea);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    
    if (mode === 'brainstorm') {
      // Brainstorm mode: max 5 images
      const combined = [...brainstormImages, ...newFiles].slice(0, 5);
      setBrainstormImages(combined);
      toast.success(`${newFiles.length} image${newFiles.length > 1 ? 's' : ''} uploaded`);
    } else {
      // Freestyle mode: max 3 images for landing page
      const combined = [...uploadedImages, ...newFiles].slice(0, 3);
      setUploadedImages(combined);
      onImagesChange?.(combined);
      toast.success(`${newFiles.length} image${newFiles.length > 1 ? 's' : ''} uploaded`);
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    if (mode === 'brainstorm') {
      const updated = brainstormImages.filter((_, i) => i !== index);
      setBrainstormImages(updated);
    } else {
      const updated = uploadedImages.filter((_, i) => i !== index);
      setUploadedImages(updated);
      onImagesChange?.(updated);
    }
    
    setLightboxIndex(null);
    toast.info('Image removed');
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const getCurrentImages = () => {
    return mode === 'brainstorm' ? brainstormImages : uploadedImages;
  };

  const nextImage = () => {
    if (lightboxIndex !== null) {
      const images = getCurrentImages();
      setLightboxIndex((lightboxIndex + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      const images = getCurrentImages();
      setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const imageFiles = Array.from(files).filter(file => 
      file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg'
    );

    if (imageFiles.length === 0) {
      toast.error('Please drop only PNG or JPEG images');
      return;
    }

    if (mode === 'brainstorm') {
      const combined = [...brainstormImages, ...imageFiles].slice(0, 5); // Max 5 images
      setBrainstormImages(combined);
    } else {
      const combined = [...uploadedImages, ...imageFiles].slice(0, 3); // Max 3 images
      setUploadedImages(combined);
      onImagesChange?.(combined);
    }
    
    toast.success(`${imageFiles.length} image${imageFiles.length > 1 ? 's' : ''} uploaded`);
  };

  return (
    <Card className="relative overflow-hidden border-2 border-accent/20" style={{
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      background: 'linear-gradient(90deg, hsla(0, 0%, 100%, 0.2), hsla(0, 0%, 100%, 0.05))',
      borderRadius: '70px',
      minHeight: '600px',
      boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
    }}>
      <CardContent className="p-4 md:p-6 flex flex-col">
        {mode === 'brainstorm' ? (
          /* BRAINSTORM MODE: Chat interface with message history */
          <div className="flex flex-col pt-[20px] pr-[0px] pb-[0px] pl-[0px] flex-1">
            {/* CHAT MESSAGES Area (Scrollable) */}
            <div className="relative flex-1 mb-4">
              <div 
                ref={chatContainerRef}
                className="w-full h-full px-2 md:px-4 py-4 overflow-y-auto flex flex-col gap-3"
                style={{ minHeight: '300px', maxHeight: '500px' }}
              >
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground italic text-center text-sm">
                      Start a conversation about your tattoo idea...
                    </p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {/* Avatar for assistant */}
                      {msg.role === 'assistant' && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
                          T
                        </div>
                      )}
                      
                      {/* Message bubble */}
                      <div
                        className={`max-w-[75%] rounded-2xl ${
                          msg.role === 'user'
                            ? 'bg-accent text-background rounded-br-sm'
                            : 'bg-white/10 text-white rounded-bl-sm'
                        }`}
                      >
                        {/* Images if present */}
                        {msg.images && msg.images.length > 0 && (
                          <div className="flex gap-2 flex-wrap p-2 pb-0">
                            {msg.images.map((file, imgIdx) => (
                              <div 
                                key={imgIdx}
                                className="w-20 h-20 rounded-lg overflow-hidden border border-white/20"
                              >
                                <img 
                                  src={URL.createObjectURL(file)} 
                                  alt={`Attachment ${imgIdx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                        {/* Text content */}
                        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed px-4 py-2.5">{msg.content}</p>
                      </div>
                      
                      {/* Avatar for user */}
                      {msg.role === 'user' && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-white/10">
                          {user?.avatar ? (
                            <img src={user.avatar} alt="You" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/60 font-bold text-sm">
                              {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
                
                {/* Loading indicator while AI is typing */}
                {showLoader && (
                  <div className="flex gap-2 justify-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
                      T
                    </div>
                    <div className="px-4 py-2.5 rounded-2xl bg-white/10 rounded-bl-sm">
                      <DiamondLoader size={24} scale={0.4} />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* INPUT Area with Image Upload and Send Button */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-end">
                {/* Image Upload Button */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  onClick={handleUploadClick}
                  disabled={isAskTaTTTyLoading}
                  className="flex-shrink-0 p-2.5 text-accent/70 hover:text-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Upload images"
                >
                  <Upload size={22} />
                </button>
                
                {/* Textarea */}
                <textarea 
                  value={brainstormInput}
                  onChange={(e) => setBrainstormInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleBrainstormSend();
                    }
                  }}
                  disabled={isAskTaTTTyLoading}
                  className="flex-1 px-4 py-3 bg-transparent border border-accent/30 focus:border-accent/50 rounded-2xl text-white placeholder:text-muted-foreground focus:outline-none transition-all resize-y disabled:opacity-50"
                  placeholder="Type your message..."
                  rows={1}
                  style={{ minHeight: '44px', maxHeight: '200px' }}
                />
                
                {/* Send Icon Button */}
                <button
                  onClick={handleBrainstormSend}
                  disabled={isAskTaTTTyLoading}
                  className="flex-shrink-0 p-2.5 text-accent hover:text-accent/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Send message"
                >
                  {isAskTaTTTyLoading ? (
                    <Sparkles size={22} className="animate-spin" />
                  ) : (
                    <Send size={22} />
                  )}
                </button>
              </div>
              
              {/* Uploaded Images Preview for Brainstorm */}
              {brainstormImages.length > 0 && (
                <div className="flex gap-2 flex-wrap px-1">
                  {brainstormImages.map((file, index) => (
                    <div 
                      key={index} 
                      className="relative group cursor-pointer"
                      onClick={() => openLightbox(index)}
                    >
                      <div className="w-14 h-14 rounded-lg border border-accent/30 overflow-hidden hover:border-accent/60 transition-colors">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={(e) => removeImage(index, e)}
                        className="absolute -top-1 -right-1 bg-destructive rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        aria-label="Remove image"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Friendly instruction message - AT THE BOTTOM */}
            <div className="text-center pt-4 pb-2 text-[16px]">
              <p className="text-white/50 text-xs font-[Roboto_Condensed] italic text-[16px]">
                Once you have your idea put together, please copy and paste it below
              </p>
            </div>
          </div>
        ) : (
          /* FREESTYLE MODE: Original single textarea */
          <div className="flex flex-col pt-[20px] pr-[0px] pb-[0px] pl-[0px]">
            <label className="block text-white px-2 mt-[0px] mr-[0px] mb-[8px] ml-[0px] font-[Orbitron] not-italic text-[24px] text-center" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)', letterSpacing: '3px' }}>{title}</label>
            
            {/* Textarea with Loading Overlay */}
            <div className="relative">
              <textarea 
                value={text}
                onChange={handleTextChange}
                disabled={isAskTaTTTyLoading}
                className={`w-full px-4 py-2 bg-transparent border rounded-2xl text-white placeholder:text-muted-foreground focus:outline-none transition-all resize-y disabled:opacity-50 ${
                  showValidationError 
                    ? 'border-destructive border-2 shadow-[0_0_20px_rgba(239,68,68,0.4)]' 
                    : 'border-accent/30 focus:border-accent/50'
                }`}
                placeholder="Enter text..."
                style={{ minHeight: '200px' }}
              />
              
              {/* Validation Error Message */}
              {showValidationError && (
                <div 
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{
                    animation: 'fadeInScale 0.3s ease-out',
                  }}
                >
                  <div 
                    className="px-6 py-3 bg-gradient-to-r from-destructive/20 to-destructive/10 backdrop-blur-md border-2 border-destructive rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.5)]"
                    style={{
                      animation: 'pulse 2s ease-in-out infinite',
                    }}
                  >
                    <p className="text-background font-[Orbitron] text-lg font-bold tracking-wider text-center">
                      ⚡ DROP SOME WORDS FIRST
                    </p>
                  </div>
                </div>
              )}
              
              {/* DiamondLoader Overlay */}
              {showLoader && (
                <div 
                  className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-2xl transition-opacity duration-500"
                  style={{
                    opacity: showLoader ? 1 : 0,
                  }}
                >
                  <DiamondLoader size={80} scale={0.8} />
                </div>
              )}
            </div>
          
            {/* Uploaded Images Preview - Only show on landing page */}
            {showUpload && uploadedImages.length > 0 && (
              <div className="mt-3 flex gap-2 flex-wrap">
                {uploadedImages.map((file, index) => (
                  <div 
                    key={index} 
                    className="relative group cursor-pointer"
                    onClick={() => openLightbox(index)}
                  >
                    <div className="w-16 h-16 rounded-lg border border-accent/30 overflow-hidden hover:border-accent/60 transition-colors">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={(e) => removeImage(index, e)}
                      className="absolute -top-1 -right-1 bg-destructive rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      aria-label="Remove image"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      {/* Splash Screen Overlay - Only show in freestyle mode */}
      {showFreestyleSplash && mode === 'freestyle' && (
        <div className="absolute inset-0" style={{ borderRadius: '70px' }}>
          {/* Initial gradient background before revealing */}
          {!isRevealing && (
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, #57f1d6 0%, #0C0C0D 100%)',
                borderRadius: '70px',
              }}
            />
          )}

          {/* Halftone Reveal Animation - Shows when button is clicked */}
          {isRevealing && (
            <HalftoneReveal 
              onComplete={handleRevealComplete}
              spacing={20}
              duration={4}
              stagger={0.05}
            />
          )}

          {/* Button with Single Sparkle - Only shows before revealing */}
          {!isRevealing && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Single Sparkle Icon Above Button */}
                <Sparkles 
                  className="absolute -top-16 left-1/2 -translate-x-1/2 text-white animate-pulse" 
                  size={40}
                  style={{ animationDuration: '1.5s' }}
                />
                
                {/* Button */}
                <button
                  className="output-type-button"
                  onClick={handleButtonClick}
                  style={{
                    // @ts-ignore
                    '--text-stroke-color': 'rgba(0, 0, 0, 0.6)',
                    '--animation-color': '#f5f5f0',
                  }}
                >
                  <span className="actual-text">&nbsp;ink.me.up  &nbsp;</span>
                  <span aria-hidden="true" className="hover-text">&nbsp;ink.me.up&nbsp;</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ask TaTTTy Button + Submit Chip + Upload (Landing Page Only) - Bottom Center */}
      {(!showFreestyleSplash) && mode === 'freestyle' && (
        <div className="flex flex-col items-center gap-3 py-3">
          {/* Ask TaTTTy Container - Only show in freestyle mode */}
          <div className="flex flex-col items-center">
            <AskTaTTTy 
              contextType="freestyle"
              size="md"
              onOptimize={handleOptimize}
              onIdeas={handleIdeas}
              onNavigate={onNavigate}
              currentText={text}
            />
          </div>

          {/* Submit Chip - Show on Landing Page and Generator Page (freestyle only) */}
          <SaveChip 
            onSubmit={handleSubmit}
            isValid={isValid}
            isSubmitted={isSubmitted}
            errorMessage={errorMessage}
          />
          
          {/* Upload Drag & Drop Container - Only on Landing Page */}
          {showUpload && (
            <div className="flex flex-col items-center w-full">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                onClick={handleUploadClick}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center gap-3 py-8 px-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                  isDragging 
                    ? 'border-accent bg-accent/20 scale-105' 
                    : 'border-accent/30 bg-transparent hover:border-accent/50 hover:bg-accent/5'
                }`}
              >
                <Upload 
                  size={32} 
                  className={`transition-colors ${isDragging ? 'text-accent' : 'text-accent/70'}`}
                />
                <div className="text-center">
                  <p className="text-accent/90 text-sm font-[Roboto_Condensed]">
                    {isDragging ? 'Drop images here' : 'Drag & drop or click to upload'}
                  </p>
                  <p className="text-accent/50 text-xs mt-1 font-[Roboto_Condensed]">
                    {uploadedImages.length}/3 images
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lightbox Modal for Uploaded Images */}
      {(showUpload || mode === 'brainstorm') && (
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
            {lightboxIndex !== null && getCurrentImages()[lightboxIndex] && (
              <div className="relative">
                {/* Main Image */}
                <div className="flex items-center justify-center p-8">
                  <img 
                    src={URL.createObjectURL(getCurrentImages()[lightboxIndex])}
                    alt={`Image ${lightboxIndex + 1}`}
                    className="max-h-[70vh] w-auto object-contain rounded-lg"
                  />
                </div>

                {/* Navigation Controls */}
                {getCurrentImages().length > 1 && (
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
                      {lightboxIndex + 1} / {getCurrentImages().length}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(lightboxIndex);
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
      )}
    </Card>
  );
}
