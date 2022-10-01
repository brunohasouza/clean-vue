import { describe, test, expect } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'

import LoginPage from './LoginPage.vue'
import { ValidationSpy } from '@/presentation/test'
import { faker } from '@faker-js/faker'

type SutTypes = {
  sut: VueWrapper
  validationSpy: ValidationSpy
}

const maketSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()

  const sut = mount(LoginPage, {
    props: {
      validation: validationSpy,
    },
  })

  return {
    sut,
    validationSpy,
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

  test('Showld call Validation with correct email', async () => {
    const { sut, validationSpy } = maketSut()
    const email = faker.internet.email()

    const emailInput = sut.find('input[type="email"]')
    emailInput.setValue(email)

    await emailInput.trigger('input')

    expect(validationSpy.fieldName).toBe('email')
    expect(validationSpy.fieldValue).toBe(email)
  })

  test('Showld call Validation with correct password', async () => {
    const { sut, validationSpy } = maketSut()
    const password = faker.internet.password()

    const passwordInput = sut.find('input[type="password"]')
    passwordInput.setValue(password)

    await passwordInput.trigger('input')

    expect(validationSpy.fieldName).toBe('password')
    expect(validationSpy.fieldValue).toBe(password)
  })
})
