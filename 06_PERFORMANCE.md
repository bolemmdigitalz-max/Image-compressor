# Prompt 06 — Performance and Memory Pass

Stress-test Compressly for large batches and large images.

Improve:
- rendering performance
- thumbnail generation
- image decoding
- compression scheduling
- memory usage
- object URL lifecycle
- ZIP creation
- unnecessary React re-renders

Do not process an unlimited number of large images simultaneously.

Use a reasonable concurrency strategy.

The UI must remain responsive during batch processing.

If an operation is CPU-heavy, investigate Web Workers or another browser-safe approach where it materially improves UX.

Do not add complexity without a measurable reason.

Test:
- 1 image
- 10 images
- 50 images
- large-resolution images
- mixed formats
