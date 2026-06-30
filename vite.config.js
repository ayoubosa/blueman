import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
    // Forward JARVIS (OpenJarvis) backend paths to `jarvis serve --port 8000`.
    // Paths are kept as-is — OpenJarvis serves /v1/* and /api/* and /health.
    proxy: {
      '/v1': { target: 'http://localhost:8000', changeOrigin: true },
      '/api': { target: 'http://localhost:8000', changeOrigin: true },
      '/health': { target: 'http://localhost:8000', changeOrigin: true },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
