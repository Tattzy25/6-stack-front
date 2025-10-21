import { env } from './env';

/**
 * Frontend-only Image Edit API
 * - Calls your external backend (not Stability directly)
 * - No keys or auth handled here
 */

export type OutputFormat = 'webp' | 'jpeg' | 'png';

export interface UpscaleResultMeta {
  finishReason?: string;
  seed?: string;
}

export async function upscaleFast4x(
  image: File | string,
  outputFormat: OutputFormat = 'png',
): Promise<{ blob: Blob; meta: UpscaleResultMeta }> {
  const endpoint = `${env.apiBaseUrl}/api/images/upscale/fast`;
  const form = new FormData();

  // Accept File or URL string; backend can decide which field to use
  if (image instanceof File) {
    form.append('image', image);
  } else {
    // If passed a URL or data URI, send as image_url; backend can fetch it
    form.append('image_url', image);
  }

  form.append('output_format', outputFormat);

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      // Do NOT include any auth here; backend owns credentials
      accept: 'image/*',
    },
    body: form,
  });

  if (!res.ok) {
    // Try to parse JSON error; otherwise throw status text
    try {
      const err = await res.json();
      throw new Error(err?.message || `HTTP ${res.status}: ${res.statusText}`);
    } catch (_) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
  }

  const blob = await res.blob();
  const meta: UpscaleResultMeta = {
    finishReason: res.headers.get('finish-reason') ?? undefined,
    seed: res.headers.get('seed') ?? undefined,
  };

  return { blob, meta };
}