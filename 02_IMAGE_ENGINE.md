# Prompt 02 — Build the Image Compression Engine

Implement the browser-side image-processing engine.

Requirements:

## Input
Accept File objects.

Validate:
- MIME type
- extension where useful
- file size
- image decodability

## Processing
Use browser-native APIs where appropriate:
- createImageBitmap
- Canvas
- OffscreenCanvas where supported
- Blob
- URL.createObjectURL

Implement:
- JPEG compression
- PNG handling
- WebP compression
- AVIF when supported by the browser
- resizing
- aspect-ratio preservation
- prevention of accidental upscaling
- output MIME selection

## Transparency
PNG images may contain transparency.

Do not convert transparent PNGs to JPEG without explicitly warning the user.

If a chosen output format cannot preserve transparency, communicate this before processing.

## Animation
Animated formats must not silently become a single static frame.

If animation is not supported by the current implementation, detect it where practical and provide a clear limitation/error message.

## Metadata
Do not promise metadata preservation unless actually implemented.

## Return Result

Create a typed result containing:
- original file
- compressed Blob
- output filename
- original size
- compressed size
- savings bytes
- savings percentage
- original width
- original height
- output width
- output height
- output MIME type
- processing duration

## Performance
Avoid holding unnecessary duplicate buffers in memory.

Clean up object URLs.

Make failures recoverable on a per-file basis so one bad image does not kill the whole batch.
