import { BusinessError } from '@payfit/common-time-model'

export class PatternAssociationNotFoundError extends BusinessError {
  constructor(workschedulePatternRecordId: string) {
    super(`Pattern ${workschedulePatternRecordId} association not found`)
  }
}
