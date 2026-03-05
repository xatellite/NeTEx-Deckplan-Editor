import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ObjectProperties from './ObjectProperties.vue'

describe('ObjectProperties.vue', () => {
  it('renders correctly', () => {
    const wrapper = mount(ObjectProperties, {
      props: {
        element: undefined,
      },
    })

    expect(wrapper.text()).toContain('Select an element to view properties.')
    expect(wrapper.html()).toMatchSnapshot()
  })
})
