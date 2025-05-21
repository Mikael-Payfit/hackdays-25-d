import { BusinessError } from '../../../../../common/errors';

export class AntiCorruptionJLCompanyIdNotFoundError extends BusinessError {
  constructor(workschedulePatternRegistryId: string) {
    super(
      `[AntiCorruption] jlCompanyID not found for workschedulePatternRegistryId ${workschedulePatternRegistryId}`
    );
  }
}
