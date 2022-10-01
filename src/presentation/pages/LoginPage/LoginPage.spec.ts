import { describe, test, expect } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'

import LoginPage from './LoginPage.vue'

describe('Login Page', () => {
  test('Should start with initial state', () => {
    const wrapper = mount(LoginPage)
    const formStatus = wrapper.findComponent({ name: 'FormStatus' })
    const submitBtn = wrapper.find('button[type="submit"]')
    const fieldStatus = wrapper.findAllComponents({ name: 'AppInput' })
    const errorStatus = fieldStatus.filter((value: VueWrapper) => {
      const span = value.find('span.status')

      return (
        span.element.textContent === '🔴' &&
        span.attributes('title') === 'Campo obrigatório'
      )
    })

    expect(formStatus.element.childElementCount).toBe(0)
    expect(submitBtn.attributes().disabled).toBeDefined()
    expect(errorStatus.length).toBe(2)
  })
})
