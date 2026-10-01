import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DeckplanEditor from '@/components/DeckplanEditor.vue'

describe('DeckplanEditor.vue', () => {
  it('renders correctly', () => {
    const wrapper = mount(DeckplanEditor)

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.html()).toMatchSnapshot()
  })
})

