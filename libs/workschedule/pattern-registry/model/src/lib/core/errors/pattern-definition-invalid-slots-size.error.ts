import { BusinessError } from '@payfit/common-time-model'

export class PatternDefinitionInvalidSlotsSizeError extends BusinessError {
  constructor(public readonly patternId?: string) {
    super(`Pattern definition invalid slots size ${patternId ?? ''}`)
  }
}
