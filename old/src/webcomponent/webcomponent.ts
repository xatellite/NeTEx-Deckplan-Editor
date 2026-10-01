import { defineCustomElement } from 'vue'
import style from '@/assets/lib.css?inline'
import { parseNeTEx } from '@/helpers/parser'
import DeckRendering from '@/components/renderer/DeckRendering.vue'

const DeckRenderingElement = defineCustomElement(DeckRendering, {
  shadowRoot: true,
  styles: [style],
})

if (typeof customElements !== 'undefined') {
  if (!customElements.get('deck-rendering')) {
    customElements.define('deck-rendering', DeckRenderingElement)
  }
}

export default {
  DeckRenderingElement,
  parseNeTEx,
}
