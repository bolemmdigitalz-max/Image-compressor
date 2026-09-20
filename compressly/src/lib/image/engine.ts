// Image compression engine. Pure browser APIs, no external deps.

import type { CompressionOptions, CompressionResult } from '../../types';
import { qualityForPreset, resolveOutputMime } from '../../utils/files';
import { buildOutputName } from '../../utils/files';
import { computeTargetSize } from './resize';
import { decodeImage, supportsAvifEncoding } from './decode';

export interface CompressInput {
  file: File;
  options: CompressionOptions;
  /** Receives incremental progress (0-100). Optional. */
  onProgress?: (pct: number) => void;
}

const MAX_PIXELS = 16384; // safety guard

export async function compressImage({ file, options, onProgress }: CompressInput): Promise<CompressionResult> {
  const start = performance.now();
  onProgress?.(5);

  // Decode the file.
  const decoded = await decodeImage(file);
  onProgress?.(25);

  // Resolve output MIME.
  let outputMime = resolveOutputMime(options.outputFormat, file.type);
  if (outputMime === 'image/avif' && !supportsAvifEncoding()) {
    // Fall back to WebP for browsers without AVIF encoding support.
    outputMime = 'image/webp';
  }
  // If we're keeping the source and the source isn't a recognized MIME, fall back to PNG.
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(outputMime)) {
    outputMime = 'image/png';
  }

  // Transparency guard: warn caller via console only; we will still produce the requested
  // format but lossy formats (JPEG) will silently flatten alpha to a white background —
  // we set that background explicitly below so the behaviour is predictable.
  const willFlattenAlpha =
    decoded.hasTransparency &&
    (outputMime === 'image/jpeg' || (outputMime === 'image/webp' && false));

  // Resolve final quality.
  const baseQuality = options.preset === 'custom' ? options.quality : qualityForPreset(options.preset);
  const quality = Math.max(1, Math.min(100, Math.round(baseQuality)));

  // Compute target.
  const target = computeTargetSize({
    srcWidth: decoded.width,
    srcHeight: decoded.height,
    maxWidth: options.maxWidth,
    maxHeight: options.maxHeight,
    scalePercent: options.scalePercent,
    preserveAspectRatio: options.preserveAspectRatio,
    preventUpscaling: options.preventUpscaling,
  });

  onProgress?.(40);

  // Draw to canvas.
  const safeW = Math.min(target.width, MAX_PIXELS);
  const safeH = Math.min(target.height, MAX_PIXELS);
  const canvas = document.createElement('canvas');
  canvas.width = safeW;
  canvas.height = safeH;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    decoded.bitmap.close?.();
    throw new Error('Canvas 2D context not available');
  }
  // Always paint a white background first to avoid transparent-to-black when flattening.
  if (willFlattenAlpha || outputMime === 'image/jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, safeW, safeH);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(decoded.bitmap, 0, 0, safeW, safeH);
  decoded.bitmap.close?.();
  onProgress?.(65);

  // Encode.
  const blob = await canvasToBlob(canvas, outputMime, quality);
  onProgress?.(95);

  const url = URL.createObjectURL(blob);
  const originalSize = file.size;
  const compressedSize = blob.size;
  const savedBytes = Math.max(0, originalSize - compressedSize);
  const savedPercent = originalSize > 0 ? (savedBytes / originalSize) * 100 : 0;

  const result: CompressionResult = {
    blob,
    url,
    name: buildOutputName(file.name, outputMime),
    type: outputMime,
    width: safeW,
    height: safeH,
    originalSize,
    compressedSize,
    savedBytes,
    savedPercent,
    durationMs: performance.now() - start,
  };
  onProgress?.(100);
  return result;
}

function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // For PNG, the second arg is ignored. For JPEG/WebP/AVIF it's the quality.
    try {
      const normalizedQuality = mime === 'image/png' ? undefined : quality / 100;
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error(`Encoding failed for ${mime}`));
            return;
          }
          resolve(blob);
        },
        mime,
        normalizedQuality,
      );
    } catch (err) {
      reject(err instanceof Error ? err : new Error('Encoding failed'));
    }
  });
}