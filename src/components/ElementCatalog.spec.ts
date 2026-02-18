import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ElementCatalog from './ElementCatalog.vue'

describe('ElementCatalog.vue', () => {
  it('renders correctly', () => {
    const wrapper = mount(ElementCatalog)

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('emits add-seat', async () => {
    const wrapper = mount(ElementCatalog)

    const button = wrapper.findAll('button')
    await button[0]?.trigger('click')

    expect(wrapper.emitted('add-seat')).toBeTruthy()
    expect(wrapper.emitted('add-seat')?.length).toBe(1)
  })

  it('emits add-door', async () => {
    const wrapper = mount(ElementCatalog)

    const button = wrapper.findAll('button')
    await button[1]?.trigger('click')

    expect(wrapper.emitted('add-door')).toBeTruthy()
    expect(wrapper.emitted('add-door')?.length).toBe(1)
  })
})
