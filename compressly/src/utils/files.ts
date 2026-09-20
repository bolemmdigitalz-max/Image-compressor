// Pure helpers for filenames, format detection, etc.

import type { ImageFormat, OutputFormat } from '../types';

export const ACCEPTED_MIME: ImageFormat[] = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

export const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

export const ACCEPT_STRING = ACCEPTED_EXTENSIONS.join(',') + ',image/jpeg,image/png,image/webp,image/avif';

export function isAcceptedFile(file: File): boolean {
  if (ACCEPTED_MIME.includes(file.type as ImageFormat)) return true;
  const lower = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export function mimeToExtension(mime: string): string {
  switch (mime) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    case 'image/avif':
      return 'avif';
    default:
      return 'bin';
  }
}

export function mimeFromName(name: string): string | null {
  const lower = name.toLowerCase();
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.avif')) return 'image/avif';
  return null;
}

export function resolveOutputMime(format: OutputFormat, sourceType: string): string {
  if (format === 'keep') return sourceType;
  return format;
}

/** Split a filename into base + extension (last dot). */
export function splitExtension(name: string): { base: string; ext: string } {
  const idx = name.lastIndexOf('.');
  if (idx <= 0 || idx === name.length - 1) return { base: name, ext: '' };
  return { base: name.slice(0, idx), ext: name.slice(idx) };
}

export function buildOutputName(originalName: string, outputMime: string): string {
  const { base, ext } = splitExtension(originalName);
  const newExt = '.' + mimeToExtension(outputMime);
  // If extension already matches, keep name. Otherwise swap.
  if (ext.toLowerCase() === newExt.toLowerCase()) return originalName;
  return `${base}${newExt}`;
}

/**
 * Resolve a set of requested output names into unique filenames.
 * Returns a list (same length, same order) of names that are all distinct.
 * Collisions are de-duplicated by suffixing `-2`, `-3`, etc. before the extension.
 */
export function uniquify(names: string[]): string[] {
  const used = new Set<string>();
  const out: string[] = [];
  for (const name of names) {
    if (!used.has(name)) {
      used.add(name);
      out.push(name);
      continue;
    }
    const { base, ext } = splitExtension(name);
    let attempt = 2;
    let candidate = `${base}-${attempt}${ext}`;
    while (used.has(candidate)) {
      attempt += 1;
      candidate = `${base}-${attempt}${ext}`;
    }
    used.add(candidate);
    out.push(candidate);
  }
  return out;
}

export function qualityForPreset(preset: string): number {
  switch (preset) {
    case 'low':
      return 50;
    case 'balanced':
      return 75;
    case 'high':
      return 90;
    default:
      return 75;
  }
}