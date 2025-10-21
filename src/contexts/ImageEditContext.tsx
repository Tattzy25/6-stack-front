import { createContext, useContext, useState, ReactNode } from 'react';

export type OutputFormat = 'webp' | 'jpeg' | 'png';

export interface ImageEditSettings {
  prompt?: string;
  negativePrompt?: string;
  seed?: number | null;
  creativity?: number | null; // 0.0 – 1.0
  outputFormat?: OutputFormat; // undefined means let backend decide
}

interface ImageEditContextValue extends ImageEditSettings {
  setPrompt: (v?: string) => void;
  setNegativePrompt: (v?: string) => void;
  setSeed: (v?: number | null) => void;
  setCreativity: (v?: number | null) => void;
  setOutputFormat: (v?: OutputFormat) => void;
}

const ImageEditContext = createContext<ImageEditContextValue | undefined>(undefined);

export function ImageEditProvider({ children, initial }: { children: ReactNode; initial?: ImageEditSettings }) {
  const [prompt, setPrompt] = useState<string | undefined>(initial?.prompt);
  const [negativePrompt, setNegativePrompt] = useState<string | undefined>(initial?.negativePrompt);
  const [seed, setSeed] = useState<number | null | undefined>(initial?.seed);
  const [creativity, setCreativity] = useState<number | null | undefined>(initial?.creativity);
  const [outputFormat, setOutputFormat] = useState<OutputFormat | undefined>(initial?.outputFormat);

  const value: ImageEditContextValue = {
    prompt,
    negativePrompt,
    seed: seed ?? null,
    creativity: creativity ?? null,
    outputFormat,
    setPrompt,
    setNegativePrompt,
    setSeed,
    setCreativity,
    setOutputFormat,
  };

  return <ImageEditContext.Provider value={value}>{children}</ImageEditContext.Provider>;
}

export function useImageEdit() {
  const ctx = useContext(ImageEditContext);
  if (!ctx) throw new Error('useImageEdit must be used within ImageEditProvider');
  return ctx;
}