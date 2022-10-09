import { FieldValidation } from '@/validation/protocols'

export class FieldValidationSpy implements FieldValidation {
  error: Error = null
  constructor(readonly field: string) {}

  validate(value: string): Error {
    console.log(value)
    return this.error
  }
}
