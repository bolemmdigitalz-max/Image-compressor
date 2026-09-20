// Domain types for Compressly

export type ImageFormat = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif';

export type OutputFormat = 'keep' | 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif';

export type QualityPreset = 'low' | 'balanced' | 'high' | 'custom';

export interface CompressionOptions {
  preset: QualityPreset;
  /** 1-100, only used when preset === 'custom' or to override the resolved preset */
  quality: number;
  outputFormat: OutputFormat;
  /** Max output width in px (0 means unlimited) */
  maxWidth: number;
  /** Max output height in px (0 means unlimited) */
  maxHeight: number;
  /** Scale the image by this percentage (1-100), 0 means off */
  scalePercent: number;
  preserveAspectRatio: boolean;
  preventUpscaling: boolean;
}

export const defaultOptions: CompressionOptions = {
  preset: 'balanced',
  quality: 75,
  outputFormat: 'keep',
  maxWidth: 0,
  maxHeight: 0,
  scalePercent: 0,
  preserveAspectRatio: true,
  preventUpscaling: true,
};

export type ImageStatus = 'idle' | 'processing' | 'done' | 'error' | 'cancelled';

export interface ImageMeta {
  id: string;
  file: File;
  name: string;
  /** Object URL for thumbnail */
  thumbnailUrl: string;
  width: number;
  height: number;
  size: number;
  type: string;
  hasTransparency?: boolean;
  status: ImageStatus;
  progress: number; // 0-100
  error?: string;
  result?: CompressionResult;
}

export interface CompressionResult {
  blob: Blob;
  /** Object URL for the compressed preview */
  url: string;
  name: string;
  type: string;
  width: number;
  height: number;
  originalSize: number;
  compressedSize: number;
  savedBytes: number;
  savedPercent: number;
  durationMs: number;
}

export interface BatchTotals {
  count: number;
  totalOriginal: number;
  totalCompressed: number;
  totalSaved: number;
  totalSavedPercent: number;
  done: number;
  failed: number;
}