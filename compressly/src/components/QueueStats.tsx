import type { BatchTotals } from '../types';
import { formatBytes, formatPercent } from '../utils/format';

interface Props {
  totals: BatchTotals;
  isProcessing: boolean;
  canCompress: boolean;
  canDownloadZip: boolean;
  onCompressAll: () => void;
  onDownloadZip: () => void;
  onClear: () => void;
  onCancel: () => void;
}

export function QueueStats({
  totals,
  isProcessing,
  canCompress,
  canDownloadZip,
  onCompressAll,
  onDownloadZip,
  onClear,
  onCancel,
}: Props) {
  const empty = totals.count === 0;
  return (
    <section
      aria-label="Batch actions"
      className="sticky top-2 z-10 mb-4 rounded-2xl border border-slate-200 bg-white/90 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:flex sm:items-center sm:gap-6">
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Images</dt>
            <dd className="font-semibold text-slate-900 dark:text-white">{totals.count}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Original</dt>
            <dd className="font-semibold text-slate-900 dark:text-white">{formatBytes(totals.totalOriginal)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Compressed</dt>
            <dd className="font-semibold text-slate-900 dark:text-white">{formatBytes(totals.totalCompressed)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Saved</dt>
            <dd className="font-semibold text-blue-600 dark:text-blue-400">
              {formatBytes(totals.totalSaved)}
              {totals.totalOriginal > 0 && (
                <span className="ml-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                  ({formatPercent(totals.totalSavedPercent)})
                </span>
              )}
            </dd>
          </div>
        </dl>

        <div className="flex flex-wrap items-center gap-2">
          {isProcessing ? (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-blue-900/40 dark:text-blue-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
          ) : (
            <button
              type="button"
              onClick={onCompressAll}
              disabled={!canCompress}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              Compress all
            </button>
          )}
          <button
            type="button"
            onClick={onDownloadZip}
            disabled={!canDownloadZip}
            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:border-blue-900/40 dark:text-blue-300 dark:hover:bg-slate-800"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download ZIP
          </button>
          <button
            type="button"
            onClick={onClear}
            disabled={empty}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V3h6v3" />
            </svg>
            Clear
          </button>
        </div>
      </div>
    </section>
  );
}