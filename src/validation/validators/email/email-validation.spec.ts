import { InvalidFieldError } from '@/validation/errors'
import { faker } from '@faker-js/faker'
import { describe, expect, test } from 'vitest'
import { EmailValidation } from './email-validation'

const makeSut = (): EmailValidation =>
  new EmailValidation(faker.database.column())

describe('EmailValidation', () => {
  test('Should return error if email is invalid', () => {
    const sut = makeSut()
    const error = sut.validate(faker.random.word())
    expect(error).toEqual(new InvalidFieldError())
  })

  test('Should return null if email is valid', () => {
    const sut = makeSut()
    const error = sut.validate(faker.internet.email())
    expect(error).toBeNull()
  })

  test('Should return null if email is empty', () => {
    const sut = makeSut()
    const error = sut.validate('')
    expect(error).toBeNull()
  })
})
