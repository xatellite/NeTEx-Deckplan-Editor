import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue({
      customElement: true,
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: 'src/webcomponent.ts',
      name: 'netex-deckplan-editor',
      formats: ['es', 'umd'],
      fileName: (format) => `netex-deckplan-editor.${format}.js`,
    },
  },
})
