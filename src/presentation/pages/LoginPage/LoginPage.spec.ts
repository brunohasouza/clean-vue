import { describe, test, expect } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { faker } from '@faker-js/faker'

import LoginPage from './LoginPage.vue'
import { AuthenticationSpy, ValidationSpy } from '@/presentation/test'

type SutTypes = {
  sut: VueWrapper
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
}

type SutParams = {
  validationError: string
}

const maketSut = (params?: SutParams): SutTypes => {
  const validationSpy = new ValidationSpy()
  const authenticationSpy = new AuthenticationSpy()
  validationSpy.errorMessage = params?.validationError

  const sut = mount(LoginPage, {
    props: {
      validation: validationSpy,
      authentication: authenticationSpy,
    },
  })

  return {
    sut,
    validationSpy,
    authenticationSpy,
  }
}

const simulateValidSubmit = async (
  sut: VueWrapper,
  email: string = faker.internet.email(),
  password: string = faker.internet.password()
): Promise<void> => {
  await populateEmailField(sut, email)
  await populatePasswordField(sut, password)

  await sut.find('form').trigger('submit.prevent')
}

const populateEmailField = async (
  sut: VueWrapper,
  email: string = faker.internet.email()
): Promise<void> => {
  await sut.find('input[type="email"]').setValue(email)
}

const populatePasswordField = async (
  sut: VueWrapper,
  password: string = faker.internet.password()
): Promise<void> => {
  await sut.find('input[type="password"]').setValue(password)
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

    await populateEmailField(sut, email)

    expect(validationSpy.fieldName).toBe('email')
    expect(validationSpy.fieldValue).toBe(email)
  })

  test('Should call Validation with correct password', async () => {
    const { sut, validationSpy } = maketSut()
    const password = faker.internet.password()

    await populatePasswordField(sut, password)

    expect(validationSpy.fieldName).toBe('password')
    expect(validationSpy.fieldValue).toBe(password)
  })

  test('Should show email error if Validation fails', async () => {
    const { sut, validationSpy } = maketSut({
      validationError: faker.random.words(),
    })

    await populateEmailField(sut)

    const emailStatus = sut
      .findAllComponents({ name: 'AppInput' })
      .find((c) => c.props().type === 'email')

    const span = emailStatus.find('span')

    expect(span.attributes('title')).toBe(validationSpy.errorMessage)
    expect(span.element.textContent).toBe('🔴')
  })

  test('Should show password error if Validation fails', async () => {
    const { sut, validationSpy } = maketSut({
      validationError: faker.random.words(),
    })

    await populatePasswordField(sut)

    const passwordStatus = sut
      .findAllComponents({ name: 'AppInput' })
      .find((c) => c.props().type === 'password')

    const span = passwordStatus.find('span')

    expect(span.attributes('title')).toBe(validationSpy.errorMessage)
    expect(span.element.textContent).toBe('🔴')
  })

  test('Should show valid password state if Validation succeeds', async () => {
    const { sut } = maketSut()

    await populatePasswordField(sut)

    const passwordStatus = sut
      .findAllComponents({ name: 'AppInput' })
      .find((c) => c.props().type === 'password')

    const span = passwordStatus.find('span')

    expect(span.attributes('title')).toBe('Tudo certo!')
    expect(span.element.textContent).toBe('🟢')
  })

  test('Should show valid email state if Validation succeeds', async () => {
    const { sut } = maketSut()

    await populateEmailField(sut)

    const passwordStatus = sut
      .findAllComponents({ name: 'AppInput' })
      .find((c) => c.props().type === 'email')

    const span = passwordStatus.find('span')

    expect(span.attributes('title')).toBe('Tudo certo!')
    expect(span.element.textContent).toBe('🟢')
  })

  test('Should enable submit button if form is valid', async () => {
    const { sut } = maketSut()

    await populateEmailField(sut)
    await populatePasswordField(sut)

    const submitButton = sut.find('button[type="submit"]')
    expect(submitButton.attributes('disabled')).toBe('false')
  })

  test('Should show spinner on submit', async () => {
    const { sut } = maketSut()

    await simulateValidSubmit(sut)

    const spinner = sut.findComponent({ name: 'FormStatus' }).find('.spinner')

    expect(spinner.exists()).toBe(true)
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = maketSut()
    const email = faker.internet.email()
    const password = faker.internet.password()

    await simulateValidSubmit(sut, email, password)

    expect(authenticationSpy.params).toEqual({
      email,
      password,
    })
  })

  test('Should call Authentication only once', async () => {
    const { sut, authenticationSpy } = maketSut()

    await simulateValidSubmit(sut)
    await simulateValidSubmit(sut)

    expect(authenticationSpy.callsCount).toBe(1)
  })
})
