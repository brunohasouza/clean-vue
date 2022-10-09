import { describe, expect, test } from 'vitest'
import { faker } from '@faker-js/faker'
import { RequiredFieldValidation } from './required-field'
import { RequiredFieldError } from '@/validation/errors'

const makeSut = (): RequiredFieldValidation =>
  new RequiredFieldValidation(faker.random.word())

describe('RequiredFieldValidation', () => {
  test('Should return error if field is empty', () => {
    const sut = makeSut()
    const error = sut.validate('')

    expect(error).toEqual(new RequiredFieldError())
  })

  test('Should return null if field is not empty', () => {
    const sut = makeSut()
    const error = sut.validate(faker.random.words())

    expect(error).toBeNull()
  })
})
