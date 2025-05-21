import { BusinessError } from '@payfit/common-time-model'

export class PatternAlreadyAssociatedError extends BusinessError {
  constructor(
    workschedulePatternRegistryId: string,
    workschedulePatternRegistryVersion: number,
    workschedulePatternRecordId: string,
  ) {
    super(
      `Pattern ${workschedulePatternRegistryId} version ${workschedulePatternRegistryVersion} record ${workschedulePatternRecordId} version already associated to this employee`,
    )
  }
}
