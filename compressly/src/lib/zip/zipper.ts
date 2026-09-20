// Build a ZIP of compressed image results.

import JSZip from 'jszip';
import type { CompressionResult } from '../../types';
import { uniquify } from '../../utils/files';

export interface ZipBuildItem {
  result: CompressionResult;
  /** Optional name override (e.g. user renamed) */
  name?: string;
}

export async function buildZip(items: ZipBuildItem[]): Promise<Blob> {
  if (items.length === 0) {
    throw new Error('Nothing to compress');
  }
  const zip = new JSZip();
  const requestedNames = items.map((item) => item.name ?? item.result.name);
  const unique = uniquify(requestedNames);
  items.forEach((item, idx) => {
    zip.file(unique[idx], item.result.blob);
  });
  return zip.generateAsync({ type: 'blob', compression: 'STORE' });
}

export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
}