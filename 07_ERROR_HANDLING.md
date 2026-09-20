# Prompt 07 — Error and Edge-Case Hardening

Find and handle realistic failure cases.

At minimum:
- unsupported file
- corrupt image
- zero-byte file
- extremely large file
- image decoding failure
- canvas failure
- unsupported output MIME
- browser feature unavailable
- compression failure
- ZIP generation failure
- download failure
- duplicate filenames
- same filename from different folders
- user removes an image while processing
- user clears queue during processing

Rules:
- Never crash the entire application because one image failed.
- Show useful human-readable errors.
- Keep successful files usable when other files fail.
- Do not expose raw stack traces to users.
- Log useful debugging information in development only.
