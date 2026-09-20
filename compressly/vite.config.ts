import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config: keep the dev server permissive so the Arena preview can load it
// from any host, and use a sensible default port.
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
  },
});