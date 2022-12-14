import { describe, test, expect, vi, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { faker } from '@faker-js/faker'

import LoginPage from './LoginPage.vue'
import { AuthenticationSpy, ValidationSpy } from '@/presentation/test'
import { InvalidCredentialsError } from '@/domain/errors'
import router from '@/presentation/router'

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
    global: {
      plugins: [router],
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

const testStatusForField = (
  sut: VueWrapper,
  type: string,
  validationError?: string
): void => {
  const appInput = sut
    .findAllComponents({ name: 'AppInput' })
    .find((c) => c.props().type === type)
  expect(appInput.exists()).toBe(true)

  const status = appInput.find('span.status')

  expect(status.attributes('title')).toBe(validationError || 'Tudo certo!')
  expect(status.element.textContent).toBe(validationError ? '????' : '????')
}

const testButtonIsDisabled = (sut: VueWrapper, isDisabled: boolean): void => {
  const button = sut.find('button[type="submit"]')
  const disabled = button.attributes('disabled')

  if (isDisabled) {
    expect(disabled).toBeDefined()
  } else {
    expect(disabled).toBeUndefined()
  }
}

describe('Login Page', () => {
  beforeEach(() => localStorage.clear())
  test('Should start with initial state', () => {
    const validationError = 'Campo obrigat??rio'
    const { sut } = maketSut({ validationError })
    const formStatus = sut.findComponent({ name: 'FormStatus' })

    expect(formStatus.element.childElementCount).toBe(0)

    testButtonIsDisabled(sut, true)
    testStatusForField(sut, 'email', validationError)
    testStatusForField(sut, 'password', validationError)
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

    testStatusForField(sut, 'email', validationSpy.errorMessage)
  })

  test('Should show password error if Validation fails', async () => {
    const { sut, validationSpy } = maketSut({
      validationError: faker.random.words(),
    })

    await populatePasswordField(sut)

    testStatusForField(sut, 'password', validationSpy.errorMessage)
  })

  test('Should show valid password state if Validation succeeds', async () => {
    const { sut } = maketSut()

    await populatePasswordField(sut)

    testStatusForField(sut, 'password')
  })

  test('Should show valid email state if Validation succeeds', async () => {
    const { sut } = maketSut()

    await populateEmailField(sut)

    testStatusForField(sut, 'email')
  })

  test('Should enable submit button if form is valid', async () => {
    const { sut } = maketSut()

    await populateEmailField(sut)
    await populatePasswordField(sut)

    testButtonIsDisabled(sut, false)
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
    const { sut, authenticationSpy } = maketSut({
      validationError: faker.random.words(),
    })

    await populateEmailField(sut)
    await sut.find('form').trigger('submit.prevent')

    expect(authenticationSpy.callsCount).toBe(0)
  })

  test('Should present error if Authentication fails', async () => {
    const { sut, authenticationSpy } = maketSut()
    const error = new InvalidCredentialsError()
    vi.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(
      Promise.reject(error)
    )
    await simulateValidSubmit(sut)

    const formStatus = sut.findComponent({ name: 'FormStatus' })

    const mainError = formStatus.find('span.error')
    const spinner = formStatus.find('.spinner')

    expect(mainError.exists()).toBe(true)
    expect(spinner.exists()).toBe(false)
    expect(mainError.element.textContent).toBe(error.message)
  })

  test('Should add accessToken to localStorage on success', async () => {
    const { sut, authenticationSpy } = maketSut()
    const replace = vi.spyOn(router, 'replace')
    const setItem = vi
      .spyOn(window.localStorage, 'setItem')
      .mockReturnValueOnce(null)

    await simulateValidSubmit(sut)
    expect(setItem).toHaveBeenCalledWith(
      'accessToken',
      authenticationSpy.account.accessToken
    )

    expect(replace).toHaveBeenCalledTimes(1)
    expect(replace).toHaveBeenCalledWith('/')
  })

  test('Should go to signup page', async () => {
    const { sut } = maketSut()
    const push = vi.spyOn(router, 'push')
    const register = sut.find('a.link')

    await register.trigger('click')

    expect(push).toHaveBeenCalledTimes(1)
    expect(push).toHaveBeenCalledWith('/signup')
  })
})
