import { BusinessError } from '@payfit/common-time-model'

export class AntiCorruptionJLContractIdNotFoundError extends BusinessError {
  constructor(employeeWorkscheduleRegistryId: string) {
    super(
      `[AntiCorruption] jlContractId not found for employeeWorkscheduleRegistryId ${employeeWorkscheduleRegistryId}`,
    )
  }
}
