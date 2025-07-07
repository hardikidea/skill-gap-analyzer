import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 👈 exposes it to external network (i.e., your Docker host)
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8000',
    },
  }
})
