// Utilities for persisting user input across auth flows

interface FreestyleInput {
  prompt: string;
  images: string[]; // Base64 encoded images
  timestamp: number;
}

interface SourceCardInput {
  inputTitle: string;
  questionTitle: string;
  timestamp: number;
}

interface GeneratorState {
  selectedGenerator: string;
  selectedStyle: string | null;
  selectedPlacement: string | null;
  selectedSize: string | null;
  selectedColorPreference: string | null;
  selectedMood: string | null;
  selectedSkintone: number;
  outputType: 'color' | 'stencil';
  freestylePrompt: string;
  freestyleImages: string[]; // Base64 encoded
  timestamp: number;
}

const FREESTYLE_KEY = 'tattty_freestyle_input';
const SOURCE_CARD_KEY = 'tattty_source_card_input';
const REDIRECT_KEY = 'tattty_auth_redirect';
const GENERATOR_STATE_KEY = 'tattty_generator_state';

export function saveFreestyleInput(prompt: string, images: File[]): void {
  try {
    // Convert File objects to base64 strings
    const imagePromises = images.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(base64Images => {
      const input: FreestyleInput = {
        prompt,
        images: base64Images,
        timestamp: Date.now(),
      };
      localStorage.setItem(FREESTYLE_KEY, JSON.stringify(input));
    });
  } catch (error) {
    console.error('Failed to save freestyle input:', error);
  }
}

export function getFreestyleInput(): FreestyleInput | null {
  try {
    const stored = localStorage.getItem(FREESTYLE_KEY);
    if (!stored) return null;

    const input: FreestyleInput = JSON.parse(stored);
    
    // Check if input is older than 24 hours
    const isExpired = Date.now() - input.timestamp > 24 * 60 * 60 * 1000;
    if (isExpired) {
      clearFreestyleInput();
      return null;
    }

    return input;
  } catch (error) {
    console.error('Failed to retrieve freestyle input:', error);
    return null;
  }
}

export function clearFreestyleInput(): void {
  localStorage.removeItem(FREESTYLE_KEY);
}

export function setAuthRedirect(page: string): void {
  localStorage.setItem(REDIRECT_KEY, page);
}

export function getAuthRedirect(): string | null {
  return localStorage.getItem(REDIRECT_KEY);
}

export function clearAuthRedirect(): void {
  localStorage.removeItem(REDIRECT_KEY);
}

// Convert base64 images back to File objects
export function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
}

// Source Card persistence
export function saveSourceCardInput(inputTitle: string, questionTitle: string): void {
  try {
    const input: SourceCardInput = {
      inputTitle,
      questionTitle,
      timestamp: Date.now(),
    };
    localStorage.setItem(SOURCE_CARD_KEY, JSON.stringify(input));
  } catch (error) {
    console.error('Failed to save source card input:', error);
  }
}

export function getSourceCardInput(): SourceCardInput | null {
  try {
    const stored = localStorage.getItem(SOURCE_CARD_KEY);
    if (!stored) return null;

    const input: SourceCardInput = JSON.parse(stored);
    
    // Check if input is older than 24 hours
    const isExpired = Date.now() - input.timestamp > 24 * 60 * 60 * 1000;
    if (isExpired) {
      clearSourceCardInput();
      return null;
    }

    return input;
  } catch (error) {
    console.error('Failed to retrieve source card input:', error);
    return null;
  }
}

export function clearSourceCardInput(): void {
  localStorage.removeItem(SOURCE_CARD_KEY);
}

// Complete Generator State persistence
export async function saveGeneratorState(
  selectedGenerator: string,
  selectedStyle: string | null,
  selectedPlacement: string | null,
  selectedSize: string | null,
  selectedColorPreference: string | null,
  selectedMood: string | null,
  selectedSkintone: number,
  outputType: 'color' | 'stencil',
  freestylePrompt: string,
  freestyleImages: File[]
): Promise<void> {
  try {
    // Convert File objects to base64 strings
    const imagePromises = freestyleImages.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    const base64Images = await Promise.all(imagePromises);

    const state: GeneratorState = {
      selectedGenerator,
      selectedStyle,
      selectedPlacement,
      selectedSize,
      selectedColorPreference,
      selectedMood,
      selectedSkintone,
      outputType,
      freestylePrompt,
      freestyleImages: base64Images,
      timestamp: Date.now(),
    };
    
    localStorage.setItem(GENERATOR_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save generator state:', error);
  }
}

export function getGeneratorState(): GeneratorState | null {
  try {
    const stored = localStorage.getItem(GENERATOR_STATE_KEY);
    if (!stored) return null;

    const state: GeneratorState = JSON.parse(stored);
    
    // Check if state is older than 24 hours
    const isExpired = Date.now() - state.timestamp > 24 * 60 * 60 * 1000;
    if (isExpired) {
      clearGeneratorState();
      return null;
    }

    return state;
  } catch (error) {
    console.error('Failed to retrieve generator state:', error);
    return null;
  }
}

export function clearGeneratorState(): void {
  localStorage.removeItem(GENERATOR_STATE_KEY);
}
