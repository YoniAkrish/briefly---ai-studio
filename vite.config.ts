import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    base: "/briefly---ai-studio/",  // <--- ADD THIS LINE
  plugins: [react()],
  // This base path ensures assets load correctly when hosted on GitHub Pages
  base: "/briefly---ai-studio/",
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  define: {
    // Expose env variables to the client
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }

})
