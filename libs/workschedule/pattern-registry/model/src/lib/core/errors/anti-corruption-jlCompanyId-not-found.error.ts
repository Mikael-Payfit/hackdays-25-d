import { BusinessError } from '@payfit/common-time-model'

export class AntiCorruptionJLCompanyIdNotFoundError extends BusinessError {
  constructor(workschedulePatternRegistryId: string) {
    super(
      `[AntiCorruption] jlCompanyID not found for workschedulePatternRegistryId ${workschedulePatternRegistryId}`,
    )
  }
}
