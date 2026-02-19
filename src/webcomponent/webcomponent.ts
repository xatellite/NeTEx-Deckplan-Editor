import { defineCustomElement } from 'vue'
import DeckplanEditor from '@/components/DeckplanEditor.vue'
import VueKonva from 'vue-konva'
import style from '@/assets/lib.css?inline'
import { parseNeTEx } from '@/helpers/parser'
import DeckVisualization from '@/components/DeckVisualization.vue'

const DeckplanEditorElement = defineCustomElement(DeckplanEditor, {
  shadowRoot: true,
  styles: [style],
  configureApp(app) {
    app.use(VueKonva)
  },
})

const DeckVisualizationElement = defineCustomElement(DeckVisualization, {
  shadowRoot: true,
  styles: [style],
  configureApp(app) {
    app.use(VueKonva)
  },
})

if (typeof customElements !== 'undefined') {
  if (!customElements.get('deckplan-editor')) {
    customElements.define('deckplan-editor', DeckplanEditorElement)
  }

  if (!customElements.get('deck-visualization')) {
    customElements.define('deck-visualization', DeckVisualizationElement)
  }
}

export default {
  DeckplanEditorElement,
  DeckVisualizationElement,
  parseNeTEx,
}
