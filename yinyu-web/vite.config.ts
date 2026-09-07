import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// 静态资源（音乐、图片）直接来自本地资源库 E:\yinyu-music\resource\static
const RESOURCE_STATIC = 'E:/yinyu-music/resource/static'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  publicDir: RESOURCE_STATIC,
  server: {
    port: 5173,
    host: true,
  },
})
