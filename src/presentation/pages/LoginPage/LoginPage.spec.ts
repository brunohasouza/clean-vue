import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import LoginPage from './LoginPage.vue'

describe('Login Page', () => {
  test('Should start with initial state', () => {
    const wrapper = mount(LoginPage)
    const formStatus = wrapper.findComponent({ name: 'FormStatus' })
    const submitBtn = wrapper.find('button[type="submit"]')

    expect(formStatus.element.childElementCount).toBe(0)
    expect(submitBtn.attributes().disabled).toBeDefined()
  })
})
