import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // Base public path when served in production
  base: './',

  // Configure server options
  server: {
    port: 3000,
    open: true, // Open browser on server start
  },

  // CSS configuration
  css: {
    modules: {
      // Enable CSS modules for files ending with .module.css
      localsConvention: 'camelCase',
      scopeBehaviour: 'local',
    },
  },

  // Build options
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
  },
})
