import { createContext, useContext, useState, ReactNode } from 'react';

export interface GeneratorSelections {
  // Generator type
  generatorType: string;
  
  // Carousel selections
  style: string | null;
  placement: string | null;
  size: string | null;
  color: string | null;
  mood: string | null;
  
  // Skintone selection (0-100 continuous value for color interpolation)
  skintone: number;
  
  // Output type
  outputType: 'color' | 'stencil';
  
  // Text inputs (stored when user clicks Save)
  textInputs: {
    [key: string]: string; // key is the generator type, value is the saved text
  };
  
  // Images (for freestyle/coverup/extend)
  images: File[];
}

interface GeneratorContextType {
  selections: GeneratorSelections;
  updateGeneratorType: (type: string) => void;
  updateStyle: (style: string | null) => void;
  updatePlacement: (placement: string | null) => void;
  updateSize: (size: string | null) => void;
  updateColor: (color: string | null) => void;
  updateMood: (mood: string | null) => void;
  updateSkintone: (skintone: number) => void;
  updateOutputType: (type: 'color' | 'stencil') => void;
  saveTextInput: (generatorType: string, text: string) => void;
  updateImages: (images: File[]) => void;
  clearAll: () => void;
  
  // For backend integration - get all data as JSON
  getSelections: () => GeneratorSelections;
}

const GeneratorContext = createContext<GeneratorContextType | undefined>(undefined);

const initialSelections: GeneratorSelections = {
  generatorType: 'tattty',
  style: null,
  placement: null,
  size: null,
  color: null,
  mood: null,
  skintone: 50, // Default to middle of continuous range (0-100)
  outputType: 'stencil',
  textInputs: {},
  images: [],
};

export function GeneratorProvider({ children }: { children: ReactNode }) {
  const [selections, setSelections] = useState<GeneratorSelections>(initialSelections);

  const updateGeneratorType = (type: string) => {
    setSelections(prev => ({ ...prev, generatorType: type }));
  };

  const updateStyle = (style: string | null) => {
    setSelections(prev => ({ ...prev, style }));
  };

  const updatePlacement = (placement: string | null) => {
    setSelections(prev => ({ ...prev, placement }));
  };

  const updateSize = (size: string | null) => {
    setSelections(prev => ({ ...prev, size }));
  };

  const updateColor = (color: string | null) => {
    setSelections(prev => ({ ...prev, color }));
  };

  const updateMood = (mood: string | null) => {
    setSelections(prev => ({ ...prev, mood }));
  };

  const updateSkintone = (skintone: number) => {
    setSelections(prev => ({ ...prev, skintone }));
  };

  const updateOutputType = (type: 'color' | 'stencil') => {
    setSelections(prev => ({ ...prev, outputType: type }));
  };

  const saveTextInput = (generatorType: string, text: string) => {
    setSelections(prev => ({
      ...prev,
      textInputs: {
        ...prev.textInputs,
        [generatorType]: text,
      },
    }));
  };

  const updateImages = (images: File[]) => {
    setSelections(prev => ({ ...prev, images }));
  };

  const clearAll = () => {
    setSelections(initialSelections);
  };

  const getSelections = () => selections;

  return (
    <GeneratorContext.Provider
      value={{
        selections,
        updateGeneratorType,
        updateStyle,
        updatePlacement,
        updateSize,
        updateColor,
        updateMood,
        updateSkintone,
        updateOutputType,
        saveTextInput,
        updateImages,
        clearAll,
        getSelections,
      }}
    >
      {children}
    </GeneratorContext.Provider>
  );
}

export function useGenerator() {
  const context = useContext(GeneratorContext);
  if (context === undefined) {
    throw new Error('useGenerator must be used within a GeneratorProvider');
  }
  return context;
}
