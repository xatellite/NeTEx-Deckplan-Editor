import { defineCustomElement } from 'vue'
import DeckplanEditor from '@/components/editor/DeckplanEditor.vue'
import VueKonva from 'vue-konva'
import style from '@/assets/lib.css?inline'
import { parseNeTEx } from '@/helpers/parser'
import DeckRendering from '@/components/renderer/DeckRendering.vue'

const DeckplanEditorElement = defineCustomElement(DeckplanEditor, {
  shadowRoot: true,
  styles: [style],
  configureApp(app) {
    app.use(VueKonva)
  },
})

const DeckRenderingElement = defineCustomElement(DeckRendering, {
  shadowRoot: true,
  styles: [style],
})

if (typeof customElements !== 'undefined') {
  if (!customElements.get('deckplan-editor')) {
    customElements.define('deckplan-editor', DeckplanEditorElement)
  }

  if (!customElements.get('deck-rendering')) {
    customElements.define('deck-rendering', DeckRenderingElement)
  }
}

export default {
  DeckplanEditorElement,
  DeckRenderingElement,
  parseNeTEx,
}
