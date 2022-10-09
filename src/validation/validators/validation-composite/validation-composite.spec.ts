import { faker } from '@faker-js/faker'
import { describe, expect, test } from 'vitest'
import { FieldValidationSpy } from '@/validation/test'
import { ValidationComposite } from './validation-composite'

type SutTypes = {
  sut: ValidationComposite
  spy: FieldValidationSpy[]
}

const makeSut = (fieldName: string): SutTypes => {
  const spy = [
    new FieldValidationSpy(fieldName),
    new FieldValidationSpy(fieldName),
  ]

  const sut = new ValidationComposite(spy)

  return {
    sut,
    spy,
  }
}

describe('ValidationComposite', () => {
  test('Should return error if any validation fails', () => {
    const field = faker.database.column()
    const { sut, spy } = makeSut(field)
    const firstError = faker.random.words()
    const secondError = faker.random.alphaNumeric(10)

    spy[0].error = new Error(firstError)
    spy[1].error = new Error(secondError)

    const error = sut.validate(field, faker.random.words())

    expect(error).toBe(firstError)
  })

  test('Should return falsy if all validation pass', () => {
    const field = faker.database.column()
    const { sut } = makeSut(field)

    const error = sut.validate(field, faker.random.words())

    expect(error).toBeFalsy()
  })
})
