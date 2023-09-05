import { UseCaseError } from '@/core/errors/use-case-error'

export class StudentAlredyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Student ${identifier} alredy exists`)
  }
}
