import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import tailwindcssPostcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    },
    postcss: {
      plugins: [
        tailwindcssPostcss,
        autoprefixer
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/ws': {
        target: 'ws://localhost:4000', // 替换为你的后端WebSocket服务地址和端口
        ws: true, // 启用WebSocket代理
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ws/, '')
      }
    }
  }
})
