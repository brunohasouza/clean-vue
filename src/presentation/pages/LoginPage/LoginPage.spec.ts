import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import LoginPage from './LoginPage.vue'

describe('Login Page', () => {
  test('Should not render spinner and error on start', () => {
    const wrapper = mount(LoginPage)
    const formStatus = wrapper.findComponent({ name: 'FormStatus' })

    expect(formStatus.element.childElementCount).toBe(0)
  })
})
