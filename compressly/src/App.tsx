import { ThemeToggle } from './components/ThemeToggle';
import { Compressor } from './features/compressor/Compressor';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-white/80 backdrop-blur dark:border-slate-800/60 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </span>
            <span className="flex items-baseline gap-2">
              <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">Compressly</span>
              <span className="hidden text-xs text-slate-500 sm:inline dark:text-slate-400">
                Privacy-first image compression
              </span>
            </span>
          </a>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs font-medium text-slate-500 sm:inline dark:text-slate-400">
              Local processing · No uploads
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <Compressor />
      </main>

      <footer className="border-t border-slate-200/60 bg-white py-8 text-sm text-slate-500 dark:border-slate-800/60 dark:bg-slate-950 dark:text-slate-400">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">Privacy</h3>
            <p>Your images are processed locally in your browser. They are not uploaded to any server.</p>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">Supported formats</h3>
            <p>JPEG, PNG, WebP, AVIF. Animated frames are not preserved.</p>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">Limitations</h3>
            <p>Very large files or batches depend on your device memory. EXIF metadata is not preserved.</p>
          </div>
        </div>
        <div className="mx-auto mt-6 max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} Compressly. Built with React, Vite & Tailwind.
          </p>
        </div>
      </footer>
    </div>
  );
}