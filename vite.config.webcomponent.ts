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
      name: 'NeTExDeckplanEditor',
      fileName: 'netex-deckplan-editor',
      formats: ['es', 'umd']
    }
  }
})
