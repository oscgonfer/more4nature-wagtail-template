import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [tailwindcss()],
  
  // Configuración de entrada
  build: {
    outDir: 'static_compiled',
    rollupOptions: {
      input: {
        main: resolve(fileURLToPath(new URL('.', import.meta.url)), 'static_src/javascript/main.js')
      },
      output: {
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.names?.endsWith('.css')) {
            return 'css/[name][extname]'
          }
          if (assetInfo.names?.match(/\.(ttf|woff|woff2)$/)) {
            return 'fonts/[name][extname]'
          }
          if (assetInfo.names?.match(/\.(png|jpe?g|gif|svg|webp)$/)) {
            return 'images/[name][extname]'
          }
          return '[name][extname]'
        }
      }
    },
    // Copiar archivos estáticos
    copyPublicDir: false
  },
  
  // Configuración del servidor de desarrollo
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      // Proxy para el servidor Django
      '!/static/': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
  
  // Configuración de CSS
  css: {
    devSourcemap: true
  },
  
  // Configuración base
  publicDir: 'static_src/images',
  
  resolve: {
    alias: {
      '@': resolve(fileURLToPath(new URL('.', import.meta.url)), 'static_src')
    }
  }
})
