import { BusinessError } from '@payfit/common-time-model'

export class PatternNameAlreadyExistError extends BusinessError {
  constructor(public readonly patternName: string) {
    super(`Pattern already exist`)
  }
}
