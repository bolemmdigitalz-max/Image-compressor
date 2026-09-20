import { useState } from 'react';
import type { CompressionOptions, QualityPreset } from '../types';

interface Props {
  options: CompressionOptions;
  onChange: (next: CompressionOptions) => void;
}

const PRESETS: Array<{ id: QualityPreset; label: string; description: string }> = [
  { id: 'high', label: 'High quality', description: 'Larger files, near-original fidelity' },
  { id: 'balanced', label: 'Balanced', description: 'Recommended default' },
  { id: 'low', label: 'Small files', description: 'Smallest files, lower fidelity' },
  { id: 'custom', label: 'Custom', description: 'Set your own quality' },
];

export function OptionsPanel({ options, onChange }: Props) {
  const [advancedOpen, setAdvancedOpen] = useState(false);

  function patch<K extends keyof CompressionOptions>(key: K, value: CompressionOptions[K]) {
    onChange({ ...options, [key]: value });
  }

  return (
    <section
      aria-label="Compression settings"
      className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900"
    >
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Compression settings</h2>
        <button
          type="button"
          onClick={() => setAdvancedOpen((v) => !v)}
          aria-expanded={advancedOpen}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus-visible:underline dark:text-blue-400 dark:hover:text-blue-300 lg:hidden"
        >
          {advancedOpen ? 'Hide advanced' : 'Show advanced'}
        </button>
      </header>

      <div>
        <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Quality preset</p>
        <div role="radiogroup" aria-label="Quality preset" className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESETS.map((p) => {
            const selected = options.preset === p.id;
            return (
              <button
                key={p.id}
                role="radio"
                aria-checked={selected}
                type="button"
                onClick={() => patch('preset', p.id)}
                className={`rounded-lg border px-3 py-2 text-left text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  selected
                    ? 'border-blue-600 bg-blue-50 text-blue-800 dark:border-blue-500 dark:bg-blue-950/30 dark:text-blue-200'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-700'
                }`}
              >
                <span className="block font-medium">{p.label}</span>
                <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                  {p.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between">
          <label htmlFor="quality" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Quality
          </label>
          <span className="text-sm tabular-nums text-blue-600 dark:text-blue-400">{options.quality}%</span>
        </div>
        <input
          id="quality"
          type="range"
          min={1}
          max={100}
          step={1}
          value={options.quality}
          disabled={options.preset !== 'custom'}
          onChange={(e) => patch('quality', Number(e.target.value))}
          className="w-full accent-blue-600 disabled:opacity-50"
        />
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Higher values preserve more detail, lower values produce smaller files. Quality affects JPEG/WebP/AVIF only.
        </p>
      </div>

      <div className={`mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 ${advancedOpen ? '' : 'hidden lg:grid'}`}>
        <div>
          <label htmlFor="output-format" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Output format
          </label>
          <select
            id="output-format"
            value={options.outputFormat}
            onChange={(e) => patch('outputFormat', e.target.value as CompressionOptions['outputFormat'])}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            <option value="keep">Keep original format</option>
            <option value="image/jpeg">Convert to JPEG</option>
            <option value="image/png">Convert to PNG</option>
            <option value="image/webp">Convert to WebP</option>
            <option value="image/avif">Convert to AVIF</option>
          </select>
        </div>
        <div>
          <label htmlFor="scale" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Scale (%)
          </label>
          <div className="flex items-center gap-2">
            <input
              id="scale"
              type="number"
              min={1}
              max={100}
              value={options.scalePercent || ''}
              placeholder="100"
              onChange={(e) => patch('scalePercent', Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm tabular-nums focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            <span className="text-sm text-slate-500 dark:text-slate-400">%</span>
          </div>
        </div>
        <div>
          <label htmlFor="max-w" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Max width (px)
          </label>
          <input
            id="max-w"
            type="number"
            min={0}
            value={options.maxWidth || ''}
            placeholder="No limit"
            onChange={(e) => patch('maxWidth', Math.max(0, Number(e.target.value) || 0))}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm tabular-nums focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="max-h" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Max height (px)
          </label>
          <input
            id="max-h"
            type="number"
            min={0}
            value={options.maxHeight || ''}
            placeholder="No limit"
            onChange={(e) => patch('maxHeight', Math.max(0, Number(e.target.value) || 0))}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm tabular-nums focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>
        <label className="col-span-1 flex items-center gap-2 sm:col-span-2">
          <input
            type="checkbox"
            checked={options.preserveAspectRatio}
            onChange={(e) => patch('preserveAspectRatio', e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-950"
          />
          <span className="text-sm text-slate-700 dark:text-slate-300">Preserve aspect ratio</span>
        </label>
        <label className="col-span-1 flex items-center gap-2 sm:col-span-2">
          <input
            type="checkbox"
            checked={options.preventUpscaling}
            onChange={(e) => patch('preventUpscaling', e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-950"
          />
          <span className="text-sm text-slate-700 dark:text-slate-300">Prevent upscaling</span>
        </label>
      </div>
    </section>
  );
}