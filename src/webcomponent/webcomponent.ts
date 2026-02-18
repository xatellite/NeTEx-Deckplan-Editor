import { defineCustomElement } from 'vue'
import DeckplanEditor from '@/components/DeckplanEditor.vue'
import WagonVisualization from '@/components/WagonVisualization.vue'
import VueKonva from 'vue-konva'
import style from '@/assets/lib.css?inline'

const DeckplanEditorElement = defineCustomElement(DeckplanEditor, {
  shadowRoot: true,
  styles: [style],
  configureApp(app) {
    app.use(VueKonva)
  },
})

const WagonVisualizationElement = defineCustomElement(WagonVisualization, {
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

  if (!customElements.get('wagon-visualization')) {
    customElements.define('wagon-visualization', WagonVisualizationElement)
  }
}
