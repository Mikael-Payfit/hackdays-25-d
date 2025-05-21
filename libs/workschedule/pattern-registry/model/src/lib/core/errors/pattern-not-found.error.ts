import { BusinessError } from '@payfit/common-time-model'

export class PatternNotFoundError extends BusinessError {
  constructor() {
    super(`Pattern not found`)
  }
}
