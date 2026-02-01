import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WagonVisualization from './WagonVisualization.vue'
import type { DeckPlan } from '@/types/deckPlan'

describe('WagonVisualization.vue', () => {
  it('renders correctly', () => {
    const mockDeckPlan = {
      attr_id: 'deckplan-1',
      decks: [],
    } as unknown as DeckPlan
    

    const wrapper = mount(WagonVisualization, {
      props: {
        deckPlans: [mockDeckPlan],
        selectedElements: [],
      },
      global: {
        stubs: {
          'v-stage': true,
          'v-layer': true,
          DeckVisualization: true,
        },
      },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
