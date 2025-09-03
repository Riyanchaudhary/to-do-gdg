import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,   // 👈 fixed port
    strictPort: true // fail instead of auto-changing if 3000 is busy
  }
})
