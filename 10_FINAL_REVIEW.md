# Prompt 10 — Ruthless Final Code Review

Review the entire Compressly codebase as a senior engineer preparing it for public release.

Do not praise the implementation.

Find problems.

Check:
- architecture
- TypeScript quality
- React patterns
- unnecessary complexity
- performance
- memory leaks
- accessibility
- browser compatibility
- error handling
- security/privacy
- mobile UX
- visual polish
- download behavior
- ZIP correctness
- filename collisions
- image format handling

For every issue:
1. Explain why it matters.
2. Fix it.
3. Re-run relevant checks.

Do not rewrite working code merely for stylistic preference.

At the end provide:
- files changed
- major fixes
- known browser limitations
- remaining risks
- commands used to verify the project

Do not declare "production ready" if major known problems remain.
