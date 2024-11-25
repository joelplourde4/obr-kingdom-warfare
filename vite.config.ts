// @ts-ignore
import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      input : {
        main: resolve('index.html'),
        unit: resolve('unit/index.html'),
        tool: resolve('tool/index.html')
      }
    }
  }
})
