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
  validationSpy.errorMessage = faker.random.words()

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

      return span.element.textContent === '🔴'
    })

    expect(formStatus.element.childElementCount).toBe(0)
    expect(submitBtn.attributes().disabled).toBeDefined()
    expect(errorStatus.length).toBe(2)
  })

  test('Should call Validation with correct email', async () => {
    const { sut, validationSpy } = maketSut()
    const email = faker.internet.email()

    await sut.find('input[type="email"]').setValue(email)

    expect(validationSpy.fieldName).toBe('email')
    expect(validationSpy.fieldValue).toBe(email)
  })

  test('Should call Validation with correct password', async () => {
    const { sut, validationSpy } = maketSut()
    const password = faker.internet.password()

    await sut.find('input[type="password"]').setValue(password)

    expect(validationSpy.fieldName).toBe('password')
    expect(validationSpy.fieldValue).toBe(password)
  })

  test('Should show email error if Validation fails', async () => {
    const { sut, validationSpy } = maketSut()

    await sut.find('input[type="email"]').setValue(faker.internet.email())

    const emailStatus = sut
      .findAllComponents({ name: 'AppInput' })
      .find((c) => c.props().type === 'email')

    const span = emailStatus.find('span')

    expect(span.attributes('title')).toBe(validationSpy.errorMessage)
    expect(span.element.textContent).toBe('🔴')
  })

  test('Should show password error if Validation fails', async () => {
    const { sut, validationSpy } = maketSut()

    await sut.find('input[type="password"]').setValue(faker.internet.password())

    const passwordStatus = sut
      .findAllComponents({ name: 'AppInput' })
      .find((c) => c.props().type === 'password')

    const span = passwordStatus.find('span')

    expect(span.attributes('title')).toBe(validationSpy.errorMessage)
    expect(span.element.textContent).toBe('🔴')
  })

  test('Should show valid password state if Validation succeeds', async () => {
    const { sut, validationSpy } = maketSut()
    validationSpy.errorMessage = null

    await sut.find('input[type="password"]').setValue(faker.internet.password())

    const passwordStatus = sut
      .findAllComponents({ name: 'AppInput' })
      .find((c) => c.props().type === 'password')

    const span = passwordStatus.find('span')

    expect(span.attributes('title')).toBe('Tudo certo!')
    expect(span.element.textContent).toBe('🟢')
  })

  test('Should show valid email state if Validation succeeds', async () => {
    const { sut, validationSpy } = maketSut()
    validationSpy.errorMessage = null

    await sut.find('input[type="password"]').setValue(faker.internet.password())

    const passwordStatus = sut
      .findAllComponents({ name: 'AppInput' })
      .find((c) => c.props().type === 'password')

    const span = passwordStatus.find('span')

    expect(span.attributes('title')).toBe('Tudo certo!')
    expect(span.element.textContent).toBe('🟢')
  })

  test('Should enable submit button if form is valid', async () => {
    const { sut, validationSpy } = maketSut()
    validationSpy.errorMessage = null

    await sut.find('input[type="email"]').setValue(faker.internet.email())
    await sut.find('input[type="password"]').setValue(faker.internet.password())

    const submitButton = sut.find('button[type="submit"]')
    expect(submitButton.attributes('disabled')).toBe('false')
  })

  test('Should show spinner on submit', async () => {
    const { sut, validationSpy } = maketSut()
    validationSpy.errorMessage = null

    await sut.find('input[type="email"]').setValue(faker.internet.email())
    await sut.find('input[type="password"]').setValue(faker.internet.password())

    await sut.find('form').trigger('submit.prevent')

    const spinner = sut.findComponent({ name: 'FormStatus' }).find('.spinner')

    expect(spinner.exists()).toBe(true)
  })
})
