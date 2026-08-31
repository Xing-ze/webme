import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// GitHub Pages 部署时通过环境变量注入 base，如 '/webme/'
// Vercel / 本地开发不设置该变量，base 为 '/'
const base = process.env.GITHUB_PAGES_BASE ?? '/'

export default defineConfig({
  base,
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    host: true
  }
})
