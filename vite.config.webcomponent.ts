import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue({
      customElement: true
    })
  ],
  build: {
    lib: {
      entry: 'src/webcomponent.ts',
      name: 'netex-deckplan-editor',
      formats: ['es', 'umd'],
      fileName: (format) => `netex-deckplan-editor.${format}.js`,
    }
  }
})
