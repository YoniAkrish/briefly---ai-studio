import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  define: {
    // This allows the code to access process.env.API_KEY during the build.
    // Using || "" ensures we don't pass 'undefined' to JSON.stringify
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || "")
  }
})