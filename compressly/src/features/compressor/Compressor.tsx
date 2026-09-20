import { useCallback, useEffect, useRef, useState } from 'react';
import { FileDropzone } from '../../components/FileDropzone';
import { ImageCard } from '../../components/ImageCard';
import { OptionsPanel } from '../../components/OptionsPanel';
import { QueueStats } from '../../components/QueueStats';
import { useImageQueue } from '../../hooks/useImageQueue';
import { buildZip, triggerDownload } from '../../lib/zip/zipper';
import type { ImageMeta } from '../../types';

export function Compressor() {
  const queue = useImageQueue();
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);

  const announce = useCallback((msg: string) => {
    setBannerMessage(msg);
    if (liveRegionRef.current) liveRegionRef.current.textContent = msg;
  }, []);

  useEffect(() => {
    if (!queue.isProcessing) return;
    const remaining = queue.items.filter((i) => i.status === 'processing').length;
    if (remaining > 0) {
      announce(`Compressing ${remaining} images…`);
    }
  }, [queue.items, queue.isProcessing, announce]);

  const handleDownloadOne = useCallback((item: ImageMeta) => {
    if (!item.result) return;
    triggerDownload(item.result.blob, item.result.name);
  }, []);

  const handleDownloadZip = useCallback(async () => {
    const ready = queue.items.filter((i) => i.result);
    if (ready.length === 0) return;
    announce('Building ZIP…');
    try {
      const blob = await buildZip(ready.map((i) => ({ result: i.result! })));
      triggerDownload(blob, `compressly-${Date.now()}.zip`);
      announce(`Downloaded ${ready.length} images.`);
    } catch {
      announce('Could not create ZIP.');
    }
  }, [queue.items, announce]);

  const handleAddFiles = useCallback(
    async (files: FileList | File[]) => {
      const result = await queue.addFiles(files);
      if (result.added > 0) {
        announce(`Added ${result.added} image${result.added === 1 ? '' : 's'}.`);
      }
      if (result.rejected.length > 0) {
        announce(`Rejected ${result.rejected.length} file${result.rejected.length === 1 ? '' : 's'}: ${result.rejected.map((r) => r.name).join(', ')}`);
      }
    },
    [queue, announce],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Compress images without uploading them.
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
            Fast, private, browser-based image compression. Your files stay on your device.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs font-medium uppercase tracking-wide text-blue-600 sm:inline dark:text-blue-400">
            Local processing
          </span>
          <span className="inline-flex h-2 w-2 rounded-full bg-blue-500 sm:hidden" aria-hidden="true" />
        </div>
      </div>

      <FileDropzone onFiles={handleAddFiles} disabled={queue.isProcessing} />

      {queue.items.length > 0 && (
        <QueueStats
          totals={queue.totals}
          isProcessing={queue.isProcessing}
          canCompress={queue.items.some((i) => i.status === 'idle' || i.status === 'error')}
          canDownloadZip={queue.totals.done > 0}
          onCompressAll={() => {
            void queue.compressAll();
          }}
          onDownloadZip={() => {
            void handleDownloadZip();
          }}
          onClear={queue.clearAll}
          onCancel={queue.cancelAll}
        />
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {queue.items.length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="space-y-3">
              {queue.items.map((item) => (
                <li key={item.id}>
                  <ImageCard
                    item={item}
                    onCompress={(id) => {
                      void queue.compressOne(id);
                    }}
                    onRemove={queue.removeItem}
                    onDownload={handleDownloadOne}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
        <aside className="space-y-6">
          <OptionsPanel options={queue.options} onChange={queue.setOptions} />
          <PrivacyCard />
        </aside>
      </div>

      {bannerMessage && (
        <div
          role="status"
          aria-live="polite"
          className="sr-only"
          ref={liveRegionRef}
        >
          {bannerMessage}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      </div>
      <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">No images yet</h2>
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        Drop one or more images above, or click <span className="font-medium text-slate-700 dark:text-slate-300">Choose images</span> to select them.
      </p>
      <ul className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <li className="rounded-full border border-slate-200 px-2.5 py-0.5 dark:border-slate-700">JPEG</li>
        <li className="rounded-full border border-slate-200 px-2.5 py-0.5 dark:border-slate-700">PNG</li>
        <li className="rounded-full border border-slate-200 px-2.5 py-0.5 dark:border-slate-700">WebP</li>
        <li className="rounded-full border border-slate-200 px-2.5 py-0.5 dark:border-slate-700">AVIF</li>
      </ul>
    </div>
  );
}

function PrivacyCard() {
  return (
    <section
      aria-label="Privacy statement"
      className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900"
    >
      <h2 className="text-base font-semibold text-slate-900 dark:text-white">Privacy first</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Your images are processed locally in your browser. They are not uploaded to our servers.
      </p>
      <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
        <li className="flex items-start gap-2">
          <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          No backend, no account, no analytics uploads.
        </li>
        <li className="flex items-start gap-2">
          <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Object URLs are revoked when files are removed.
        </li>
        <li className="flex items-start gap-2">
          <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Image bytes never leave your device.
        </li>
      </ul>
    </section>
  );
}