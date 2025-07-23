import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [vue()],
    server: {
      port: 5713,
      strictPort: true,
      host: 'localhost'
    }
  }

  // Set different API URLs based on command
  if (command === 'serve') {
    // Development
    config.define = {
      'import.meta.env.VITE_API_URL': JSON.stringify('http://localhost:8000')
    }
  } else {
    // Production
    config.define = {
      'import.meta.env.VITE_API_URL': JSON.stringify('https://ovis-backend-mvp.onrender.com')
    }
  }

  return config
})
