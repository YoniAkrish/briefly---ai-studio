import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Removed specific base path so it works on Netlify root
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  define: {
    // This allows the code to access process.env.API_KEY during the build
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
})