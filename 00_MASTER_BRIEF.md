# Compressly — Master Build Brief

You are a senior frontend engineer, UI/UX designer, and product engineer.

Build **Compressly**, a production-quality, privacy-first browser-based bulk image compressor.

## Stack
- React
- Vite
- TypeScript
- Tailwind CSS
- Modern semantic HTML
- Browser APIs
- JSZip for ZIP creation
- No backend
- No database
- No authentication
- No image uploads to any server

## Core Promise
Users can select multiple images, compress them entirely in their browser, compare original vs compressed sizes, and download individual files or all compressed files as a ZIP.

## Privacy
Images must never be uploaded to a backend or third-party API. All processing must happen locally in the browser.

## Initial Formats
- JPEG/JPG
- PNG
- WebP
- AVIF where browser support allows it

Do not silently destroy transparency or animation. Clearly communicate format limitations.

## Required Features
1. Drag-and-drop upload
2. File picker
3. Multiple selection
4. Image previews
5. File names
6. Original dimensions
7. Original file size
8. Quality controls
9. Resize controls
10. Preserve aspect ratio
11. Individual compression
12. Bulk compression
13. Progress indication
14. Before/after sizes
15. Percentage reduction
16. Individual downloads
17. Download-all ZIP
18. Remove individual files
19. Clear all
20. Empty states
21. Error states
22. Unsupported-file handling
23. Dark/light mode
24. Mobile-first responsive design
25. Keyboard accessibility
26. Privacy explanation
27. No account required

## Quality Presets
- Low compression
- Balanced
- High compression
- Custom quality slider

Do not claim that a quality percentage is identical to a guaranteed percentage file-size reduction.

## Resize
Allow:
- Original dimensions
- Custom maximum width
- Custom maximum height
- Percentage scaling
- Preserve aspect ratio
- Prevent upscaling by default

## UX
The main workflow should be:

Upload → Configure → Compress → Review → Download

The interface should feel like a polished modern SaaS utility, not a tutorial demo.

## Design Direction
- Minimal
- Premium
- Fast
- Clean
- Strong typography
- Generous whitespace
- Subtle borders
- Subtle shadows
- Excellent mobile UX
- No unnecessary gradients
- No excessive glassmorphism
- No fake testimonials
- No fake statistics

Use accessible contrast and visible focus states.

## Important Engineering Rules
- Use reusable components.
- Keep image-processing logic separate from UI.
- Keep ZIP logic separate from UI.
- Use TypeScript types properly.
- Avoid `any`.
- Handle browser API failures gracefully.
- Revoke object URLs when no longer needed.
- Avoid memory leaks.
- Avoid blocking the UI unnecessarily.
- Do not store image blobs in localStorage.
- Do not send image data to analytics.
- Do not add unnecessary dependencies.

## Suggested Structure

src/
  components/
  features/
    compressor/
  hooks/
  lib/
    image/
    zip/
  types/
  utils/
  App.tsx
  main.tsx

## Deliverable
Build the complete application, not a mockup.

Before declaring completion:
- run the app
- test the main workflow
- test multiple images
- test invalid files
- test large images
- test download
- test ZIP generation
- test responsive layouts
- fix console errors
- fix TypeScript errors
- verify object URL cleanup
