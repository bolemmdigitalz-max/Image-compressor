// Compressly image queue state + actions.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { BatchTotals, CompressionOptions, CompressionResult, ImageMeta } from '../types';
import { defaultOptions } from '../types';
import { decodeImage } from '../lib/image/decode';
import { compressImage } from '../lib/image/engine';
import { isAcceptedFile } from '../utils/files';
import { safeId } from '../utils/format';

const MAX_FILE_BYTES = 100 * 1024 * 1024; // 100MB hard cap
const CONCURRENCY = 2;

interface AddFilesResult {
  added: number;
  rejected: Array<{ name: string; reason: string }>;
}

function rejectionReason(file: File): string {
  if (!isAcceptedFile(file)) return 'Unsupported file type';
  if (file.size === 0) return 'Empty file';
  if (file.size > MAX_FILE_BYTES) return 'File exceeds 100MB';
  return 'Invalid file';
}

async function fileToMeta(file: File): Promise<ImageMeta> {
  let width = 0;
  let height = 0;
  let thumbnailUrl = '';
  try {
    const decoded = await decodeImage(file);
    width = decoded.width;
    height = decoded.height;
    thumbnailUrl = URL.createObjectURL(file);
    decoded.bitmap.close?.();
  } catch {
    thumbnailUrl = '';
  }
  return {
    id: safeId('img'),
    file,
    name: file.name,
    thumbnailUrl,
    width,
    height,
    size: file.size,
    type: file.type,
    status: 'idle',
    progress: 0,
  };
}

export interface QueueApi {
  items: ImageMeta[];
  totals: BatchTotals;
  options: CompressionOptions;
  setOptions: (next: CompressionOptions) => void;
  addFiles: (files: FileList | File[]) => Promise<AddFilesResult>;
  removeItem: (id: string) => void;
  clearAll: () => void;
  compressOne: (id: string) => Promise<void>;
  compressAll: () => Promise<void>;
  cancelAll: () => void;
  isProcessing: boolean;
}

export function useImageQueue(): QueueApi {
  const [items, setItems] = useState<ImageMeta[]>([]);
  const [options, setOptions] = useState<CompressionOptions>(defaultOptions);
  const [isProcessing, setIsProcessing] = useState(false);
  const cancelledRef = useRef<boolean>(false);
  const itemsRef = useRef<ImageMeta[]>(items);
  const optionsRef = useRef<CompressionOptions>(options);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const updateItem = useCallback((id: string, patch: Partial<ImageMeta>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }, []);

  const addFiles = useCallback<QueueApi['addFiles']>(async (files) => {
    const list = Array.from(files);
    const accepted: File[] = [];
    const rejected: AddFilesResult['rejected'] = [];
    for (const file of list) {
      if (!isAcceptedFile(file) || file.size === 0 || file.size > MAX_FILE_BYTES) {
        rejected.push({ name: file.name, reason: rejectionReason(file) });
      } else {
        accepted.push(file);
      }
    }
    const newMetas = await Promise.all(accepted.map(fileToMeta));
    setItems((prev) => [...prev, ...newMetas]);
    return { added: accepted.length, rejected };
  }, []);

  const removeItem = useCallback<QueueApi['removeItem']>((id) => {
    setItems((prev) => {
      const target = prev.find((it) => it.id === id);
      if (target) {
        if (target.thumbnailUrl) URL.revokeObjectURL(target.thumbnailUrl);
        if (target.result?.url) URL.revokeObjectURL(target.result.url);
      }
      return prev.filter((it) => it.id !== id);
    });
  }, []);

  const clearAll = useCallback<QueueApi['clearAll']>(() => {
    setItems((prev) => {
      prev.forEach((it) => {
        if (it.thumbnailUrl) URL.revokeObjectURL(it.thumbnailUrl);
        if (it.result?.url) URL.revokeObjectURL(it.result.url);
      });
      return [];
    });
  }, []);

  /**
   * Internal: compress a single image by id, reading from refs so the callback
   * identity is stable across renders.
   */
  const compressOneById = useCallback(
    async (id: string) => {
      const target = itemsRef.current.find((it) => it.id === id);
      if (!target) return;
      updateItem(id, { status: 'processing', progress: 0, error: undefined, result: undefined });
      try {
        const result: CompressionResult = await compressImage({
          file: target.file,
          options: optionsRef.current,
          onProgress: (pct) => updateItem(id, { progress: pct }),
        });
        updateItem(id, { status: 'done', progress: 100, result });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Compression failed';
        updateItem(id, { status: 'error', progress: 0, error: message });
      }
    },
    [updateItem],
  );

  const compressOne = useCallback<QueueApi['compressOne']>(
    (id) => compressOneById(id),
    [compressOneById],
  );

  const cancelAll = useCallback<QueueApi['cancelAll']>(() => {
    cancelledRef.current = true;
  }, []);

  const compressAll = useCallback<QueueApi['compressAll']>(async () => {
    cancelledRef.current = false;
    setIsProcessing(true);
    const targets = itemsRef.current.filter((it) => it.status !== 'processing' && it.status !== 'done');
    let cursor = 0;

    async function worker() {
      while (cursor < targets.length) {
        if (cancelledRef.current) return;
        const idx = cursor++;
        const target = targets[idx];
        if (!target) return;
        await compressOneById(target.id);
      }
    }
    const workerCount = Math.min(CONCURRENCY, targets.length);
    const workers = Array.from({ length: workerCount }, () => worker());
    await Promise.all(workers);
    setIsProcessing(false);
  }, [compressOneById]);

  const totals: BatchTotals = useMemo(() => {
    const done = items.filter((it) => it.status === 'done').length;
    const failed = items.filter((it) => it.status === 'error').length;
    const totalOriginal = items.reduce((s, it) => s + it.size, 0);
    const totalCompressed = items.reduce(
      (s, it) => s + (it.result ? it.result.compressedSize : 0),
      0,
    );
    const totalSaved = Math.max(0, totalOriginal - totalCompressed);
    const totalSavedPercent = totalOriginal > 0 ? (totalSaved / totalOriginal) * 100 : 0;
    return {
      count: items.length,
      totalOriginal,
      totalCompressed,
      totalSaved,
      totalSavedPercent,
      done,
      failed,
    };
  }, [items]);

  return {
    items,
    totals,
    options,
    setOptions,
    addFiles,
    removeItem,
    clearAll,
    compressOne,
    compressAll,
    cancelAll,
    isProcessing,
  };
}