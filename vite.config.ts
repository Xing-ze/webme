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
  },
  optimizeDeps: {
    include: ['gsap', 'dexie']
  },
  build: {
    chunkSizeWarningLimit: 1024,
    rollupOptions: {
      output: {
        manualChunks: {
          // 运行时核芯（Vue生态）
          'vue-core': ['vue', 'vue-router', 'pinia'],
          // GSAP 动画
          'gsap-lib': ['gsap'],
          // echarts 最小化核芯
          'echarts-lib': [
            'echarts/core',
            'echarts/renderers',
            'echarts/charts',
            'echarts/components',
          ],
          // 图标库
          'lucide': ['lucide-vue-next'],
          // Dexie 数据库
          'dexie': ['dexie'],
        },
      },
    },
  },
})
