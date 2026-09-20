// Decode an image File into dimensions + ImageBitmap (or HTMLImageElement fallback).

import type { ImageFormat } from '../../types';

export interface DecodedImage {
  bitmap: ImageBitmap;
  width: number;
  height: number;
  hasTransparency: boolean;
}

/** Try to detect a fully transparent or partially transparent image by sampling canvas pixels. */
async function detectTransparency(file: File): Promise<boolean> {
  // Only relevant for formats that may carry alpha.
  if (file.type !== 'image/png' && file.type !== 'image/webp') return false;
  try {
    const url = URL.createObjectURL(file);
    try {
      const img = await loadImageElement(url);
      const canvas = document.createElement('canvas');
      // Sample at small size for speed.
      const w = Math.min(img.naturalWidth || 32, 64);
      const h = Math.min(img.naturalHeight || 32, 64);
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return false;
      ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] < 255) return true;
      }
      return false;
    } finally {
      URL.revokeObjectURL(url);
    }
  } catch {
    return false;
  }
}

function loadImageElement(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Image failed to load'));
    img.src = url;
  });
}

export async function decodeImage(file: File): Promise<DecodedImage> {
  // createImageBitmap is the modern, fast path.
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file);
      const alpha = await detectTransparency(file);
      return { bitmap, width: bitmap.width, height: bitmap.height, hasTransparency: alpha };
    } catch {
      // fall through to Image element path
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImageElement(url);
    const alpha = await detectTransparency(file);
    // Wrap as a bitmap-compatible object via a small canvas draw.
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');
    ctx.drawImage(img, 0, 0);
    const bitmap = await createImageBitmap(canvas);
    return { bitmap, width: bitmap.width, height: bitmap.height, hasTransparency: alpha };
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Try to load AVIF encoder by checking if the browser supports outputting AVIF. */
export function supportsAvifEncoding(): boolean {
  if (typeof document === 'undefined') return false;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  const data = canvas.toDataURL('image/avif');
  return data.startsWith('data:image/avif');
}

export function isImageFormat(mime: string): mime is ImageFormat {
  return ['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(mime);
}