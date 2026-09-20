// Drag-and-drop upload zone with click-to-pick fallback. Fully keyboard accessible.

import { useCallback, useRef, useState } from 'react';
import { ACCEPT_STRING } from '../utils/files';

interface Props {
  onFiles: (files: FileList | File[]) => void;
  disabled?: boolean;
}

export function FileDropzone({ onFiles, disabled }: Props) {
  const [isOver, setIsOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (list: FileList | null) => {
      if (!list || list.length === 0) return;
      onFiles(list);
    },
    [onFiles],
  );

  return (
    <div
      role="region"
      aria-label="Upload images"
      onDragOver={(e) => {
        if (disabled) return;
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        if (disabled) return;
        e.preventDefault();
        setIsOver(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={`relative rounded-2xl border-2 border-dashed bg-white p-6 sm:p-10 text-center transition dark:bg-slate-900 ${
        isOver
          ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20'
          : 'border-blue-200 hover:border-blue-400 dark:border-blue-900/40 dark:hover:border-blue-700'
      } ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_STRING}
        multiple
        className="sr-only"
        onChange={(e) => {
          handleFiles(e.target.files);
          // Allow selecting the same file again.
          e.target.value = '';
        }}
        aria-label="Choose image files"
        tabIndex={-1}
      />
      <div className="mx-auto flex max-w-md flex-col items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          {isOver ? 'Release to add files' : 'Drag & drop images here'}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          or use the buttons below. JPEG, PNG, WebP, AVIF.
        </p>
        <div className="mt-2 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950 disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            Choose images
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
          Files stay on your device. Nothing is uploaded.
        </p>
      </div>
    </div>
  );
}