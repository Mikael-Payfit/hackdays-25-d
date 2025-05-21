import { BusinessError } from '@payfit/common-time-model'

export class PatternUpdateSameValueError extends BusinessError {
  constructor(public readonly patternId: string) {
    super(`Can not update pattern with same values ${patternId}`)
  }
}
