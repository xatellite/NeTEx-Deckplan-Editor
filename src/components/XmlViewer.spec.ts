import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import XmlViewer from './XmlViewer.vue'

describe('XmlViewer.vue', () => {
  it('renders correctly', () => {
    const xml = `<Test></Test>`

    const wrapper = mount(XmlViewer, {
      props: {
        xml,
        selectedId: undefined,
      },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
