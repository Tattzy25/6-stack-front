import { env } from '../../utils/env';

export type SD35AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
export type SD35OutputFormat = 'webp' | 'png' | 'jpeg';

export interface SD35FlashOptions {
  prompt: string;
  negativePrompt?: string;
  aspectRatio?: SD35AspectRatio;
  seed?: number;
  outputFormat?: SD35OutputFormat;
}

export interface SD35FlashResult {
  base64: string; // raw base64 image data (no prefix)
  dataUrl: string; // data URL for direct <img src>
  mimeType: string;
  rateLimitRemaining?: number | null;
  finishReason?: string | null;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000; // avoid call stack limits
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  // btoa expects binary string
  return btoa(binary);
}

/**
 * Generate an image using Stability AI SD3.5 Flash model (client-side only).
 * No UI changes, no backend integration here.
 */
export async function generateSD35Flash(options: SD35FlashOptions): Promise<SD35FlashResult> {
  const {
    prompt,
    negativePrompt,
    aspectRatio,
    seed,
    outputFormat = 'webp',
  } = options;

  if (!env.stabilityApiKey) {
    throw new Error('Missing VITE_STABILITY_API_KEY. Set it to call Stability AI directly from the client.');
  }

  const endpoint = `${env.stabilityApiBaseUrl || 'https://api.stability.ai'}/v2beta/stable-image/generate/sd3`;

  const form = new FormData();
  form.append('model', 'sd3.5-flash');
  form.append('output_format', outputFormat);
  form.append('prompt', prompt);
  if (negativePrompt) form.append('negative_prompt', negativePrompt);
  if (typeof seed === 'number') form.append('seed', String(seed));
  if (aspectRatio) form.append('aspect_ratio', aspectRatio);

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.stabilityApiKey}`,
    },
    body: form,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Stability request failed (${res.status}): ${text || res.statusText}`);
  }

  const rateLimitHeader = res.headers.get('x-inkwell-rate-limit-remaining');
  const finishReasonHeader = res.headers.get('finish-reason');

  const mimeType: string =
    outputFormat === 'png' ? 'image/png' : outputFormat === 'jpeg' ? 'image/jpeg' : 'image/webp';

  const buf = await res.arrayBuffer();
  const base64 = arrayBufferToBase64(buf);
  const dataUrl = `data:${mimeType};base64,${base64}`;

  return {
    base64,
    dataUrl,
    mimeType,
    rateLimitRemaining: rateLimitHeader ? Number(rateLimitHeader) : null,
    finishReason: finishReasonHeader,
  };
}