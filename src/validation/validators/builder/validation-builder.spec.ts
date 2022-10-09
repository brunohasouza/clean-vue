import { describe, expect, test } from 'vitest'
import { faker } from '@faker-js/faker'
import {
  RequiredFieldValidation,
  EmailValidation,
  MinLengthValidation,
} from '@/validation/validators'
import { ValidationBuilder } from './validation-builder'

describe('ValidationBuilder', () => {
  test('Should return RequiredFieldValidation', () => {
    const field = faker.database.column()
    const validations = ValidationBuilder.field(field).required().build()

    expect(validations).toEqual([new RequiredFieldValidation(field)])
  })

  test('Should return EmailValidation', () => {
    const field = faker.database.column()
    const validations = ValidationBuilder.field(field).email().build()

    expect(validations).toEqual([new EmailValidation(field)])
  })

  test('Should return MinLengthValidation', () => {
    const field = faker.database.column()
    const validations = ValidationBuilder.field(field).min(5).build()

    expect(validations).toEqual([new MinLengthValidation(field, 5)])
  })

  test('Should a list of validations', () => {
    const field = faker.database.column()
    const validations = ValidationBuilder.field(field)
      .required()
      .min(5)
      .email()
      .build()

    expect(validations).toEqual([
      new RequiredFieldValidation(field),
      new MinLengthValidation(field, 5),
      new EmailValidation(field),
    ])
  })
})
