import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * @file vite.config.js
 * @description The configuration file for Vite.
 * @module vite.config
 */

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})