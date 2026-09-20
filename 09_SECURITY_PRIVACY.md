# Prompt 09 — Privacy and Security Audit

Audit Compressly specifically for privacy.

Requirements:
- No image uploads.
- No image data in URLs.
- No image data in localStorage/sessionStorage.
- No image data sent to analytics.
- No third-party image-processing APIs.
- No unnecessary external requests.
- Revoke object URLs.
- Avoid exposing image blobs globally.
- Avoid logging image contents.

Add a clear UI statement:

"Your images are processed locally in your browser. They are not uploaded to our servers."

Only display this statement if it accurately describes the implementation.

Also inspect dependencies and remove unnecessary packages.
