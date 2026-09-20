# Compressly

**Privacy-first image compression, entirely in your browser.**

Compressly lets you select one or many images (JPEG, PNG, WebP, AVIF), compress and resize them locally in your browser, and download the results individually or as a ZIP. Nothing is ever uploaded.

## Features

- Drag-and-drop upload and file picker
- Multi-file selection with live previews and per-file status
- Quality presets (Low / Balanced / High) plus a custom quality slider
- Output format conversion (keep, JPEG, PNG, WebP, AVIF) — with AVIF auto-fallback to WebP on browsers without an AVIF encoder
- Resize controls: max width / max height, percentage scale, aspect-ratio preservation, prevent upscaling
- Bulk compression with a small worker pool (UI stays responsive)
- Per-item progress, savings %, original vs compressed dimensions
- Download a single image or all compressed images as a single ZIP
- Dark / light theme toggle, persisted across reloads
- Mobile-first responsive layout
- Object URLs are revoked automatically when items are removed or cleared
- Privacy notice that accurately reflects the implementation

## Tech stack

- React 19 + TypeScript + Vite
- Tailwind CSS 3 (white + blue palette, dark mode via `class` strategy)
- Browser-native APIs: `createImageBitmap`, `<canvas>`, `URL.createObjectURL`
- [`jszip`](https://stuk.github.io/jszip/) for ZIP packaging
- No backend, no database, no third-party image processing APIs

## Getting started

```bash
npm install
npm run dev      # start dev server (http://localhost:5173)
npm run build    # production build into dist/
npm run preview  # serve the production build locally
npm run test     # run unit smoke tests (engine + utility helpers)
```

## Project layout

```
src/
  components/        # reusable UI primitives (Button, ProgressBar, ImageCard, …)
  features/compressor/  # main Compressor feature (orchestrates upload → compress → download)
  hooks/             # useTheme, useImageQueue
  lib/
    image/           # decode, resize math, compression engine (UI-free)
    zip/             # JSZip wrapper + download trigger
  types/             # shared TypeScript types
  utils/             # pure helpers (formatting, filenames, validators)
  App.tsx, main.tsx, index.css
scripts/
  smoke.mjs          # Node-runnable unit tests for pure logic
```

## Architecture notes

- The image engine (`src/lib/image/engine.ts`) knows nothing about React. It takes a `File` and `CompressionOptions` and returns a `CompressionResult`. This keeps it deterministic and easy to test.
- The queue hook (`useImageQueue`) owns all state, runs a small worker pool, and tracks per-item progress.
- `useTheme` persists the user's choice in `localStorage` and respects `prefers-color-scheme` on first visit.
- Memory: thumbnail and result URLs are revoked on remove / clear. We do not store image bytes in `localStorage`.

## Browser support

- Chromium / Edge / Firefox / Safari — current versions
- AVIF output is gated by `canvas.toDataURL('image/avif')` and falls back to WebP
- Animated images (animated WebP / GIF) are not supported — they decode to a single frame

## Limitations

- EXIF / XMP / IPTC metadata is **not** preserved
- Transparent PNG / WebP converted to JPEG will be flattened onto a white background
- Very large images (e.g. > 50 MP) may exceed canvas limits on some browsers — a 16,384px safety guard is applied
- Performance depends on the user's device and available memory
- The `quality` setting controls encoder quality, not a guaranteed byte-size reduction

## Privacy

- All processing happens in your browser using browser-native APIs
- No image data is sent to any server, analytics endpoint, or third party
- No accounts, no telemetry
- The "Privacy first" panel and footer state this honestly

## Testing

Run the unit smoke tests:

```bash
npm run test
```

These cover the pure helpers (resize math, filename uniquification, byte / percent formatting, preset quality mapping, ID generation) and have no DOM dependency.