import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DeckplanEditor from './DeckplanEditor.vue'

describe('DeckplanEditor.vue', () => {
  it('renders correctly', () => {
    const wrapper = mount(DeckplanEditor, {
      global: {
        stubs: {
          WagonVisualization: true,
          ObjectProperties: true,
          ElementCatalog: true,
          XmlViewer: true,
        },
      },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
