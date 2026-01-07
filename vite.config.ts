import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@google/generative-ai')) {
              return 'chunk-ai';
            }
            if (id.includes('firebase')) {
              return 'chunk-firebase';
            }
            if (id.includes('react-router-dom')) {
              return 'chunk-router';
            }
            return 'vendor';
          }
        },
      },
    },
  },
})
