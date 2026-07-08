import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // es2019 so optional chaining / nullish coalescing are transpiled away —
    // lets react-snap's (older) Chromium execute the bundle during prerender.
    target: 'es2019',
    rollupOptions: {
      output: {
        // Split large vendor libs out of the main bundle for faster first load.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
})
