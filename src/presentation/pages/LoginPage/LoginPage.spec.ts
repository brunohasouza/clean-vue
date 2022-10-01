import { describe, test, expect } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'

import LoginPage from './LoginPage.vue'

type SutTypes = {
  sut: VueWrapper
}

const maketSut = (): SutTypes => {
  const sut = mount(LoginPage)

  return {
    sut,
  }
}

describe('Login Page', () => {
  test('Should start with initial state', () => {
    const { sut } = maketSut()
    const formStatus = sut.findComponent({ name: 'FormStatus' })
    const submitBtn = sut.find('button[type="submit"]')
    const fieldStatus = sut.findAllComponents({ name: 'AppInput' })
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
