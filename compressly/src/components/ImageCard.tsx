import type { ImageMeta } from '../types';
import { formatBytes, formatPercent } from '../utils/format';
import { ProgressBar } from './ProgressBar';

interface Props {
  item: ImageMeta;
  onCompress: (id: string) => void;
  onRemove: (id: string) => void;
  onDownload: (item: ImageMeta) => void;
}

export function ImageCard({ item, onCompress, onRemove, onDownload }: Props) {
  const { result } = item;
  const showProgress = item.status === 'processing';
  const showResult = item.status === 'done' && result;

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:shadow-sm sm:flex-row sm:items-stretch sm:gap-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex shrink-0 items-center justify-center sm:w-24 sm:h-24 w-full h-32 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
        {item.thumbnailUrl ? (
          <img
            src={item.thumbnailUrl}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="text-slate-400 text-xs">No preview</div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white" title={item.name}>
              {item.name}
            </h3>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {item.width > 0 ? `${item.width} × ${item.height} px` : 'Decoding…'} · {formatBytes(item.size)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            aria-label={`Remove ${item.name}`}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-slate-800"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {showProgress && (
          <div className="mt-2">
            <ProgressBar value={item.progress} ariaLabel={`Compressing ${item.name}`} />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Compressing… {Math.round(item.progress)}%
            </p>
          </div>
        )}

        {item.status === 'error' && (
          <p className="mt-2 text-xs text-red-600 dark:text-red-400">
            {item.error || 'Failed to compress.'}
          </p>
        )}

        {showResult && (
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
              {formatBytes(result.compressedSize)}
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              {result.width} × {result.height} px
            </span>
            <span
              className={`font-medium ${
                result.savedPercent >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {result.savedPercent >= 0 ? '−' : '+'}
              {formatPercent(Math.abs(result.savedPercent))}
            </span>
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {item.status !== 'done' && item.status !== 'processing' && (
            <button
              type="button"
              onClick={() => onCompress(item.id)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950"
            >
              Compress
            </button>
          )}
          {item.status === 'processing' && (
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600/70 px-3 py-1.5 text-xs font-medium text-white"
            >
              <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a9 9 0 1 0 9 9" />
              </svg>
              Compressing
            </button>
          )}
          {showResult && (
            <button
              type="button"
              onClick={() => onDownload(item)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-blue-900/40 dark:text-blue-300 dark:hover:bg-slate-800"
            >
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download
            </button>
          )}
        </div>
      </div>
    </article>
  );
}