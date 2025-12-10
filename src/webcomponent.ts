import { defineCustomElement } from 'vue'
import TestComponent from './components/TestComponent.vue'

const TestComponentElement = defineCustomElement(TestComponent)

if (!customElements.get('test-component')) {
  customElements.define('test-component', TestComponentElement)
}