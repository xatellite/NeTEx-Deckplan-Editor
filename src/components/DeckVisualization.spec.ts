import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DeckVisualization from './DeckVisualization.vue'
import type { Deck } from '../types/deck'

describe('DeckVisualization.vue', () => {
  it('renders correctly', () => {
    const mockDeck = {
      Width: 10,
      Length: 20,
      deckspaces: [],
      getShape: () => ({
        x: 0,
        y: 0,
        width: 200,
        height: 100,
      }),
    } as unknown as Deck

    const wrapper = mount(DeckVisualization, {
      props: {
        deck: mockDeck,
        scale: 10,
        selectedElements: [],
      },
      global: {
        stubs: {
          'v-rect': true,
          'v-group': true,
          'v-text': true,
          'v-line': true,
        },
      },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
