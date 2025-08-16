import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { 
    port: 5174,
    headers: {
      'Content-Security-Policy': "frame-ancestors 'self' https://www.yoga.ulyxes.xyz https://yoga.ulyxes.xyz http://localhost:5174 http://localhost:5175 https://auth.privy.io"
    }
  },
  optimizeDeps: {
    include: ['buffer']
  }
})

