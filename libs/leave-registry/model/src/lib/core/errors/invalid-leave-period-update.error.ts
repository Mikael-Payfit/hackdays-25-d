import { BusinessError } from '@payfit/common-time-model'

export class InvalidLeavePeriodUpdateError extends BusinessError {
  constructor(periodUpdateValidationErrors: string[]) {
    super(
      `Invalid leave period update: ${periodUpdateValidationErrors.join(', ')}`,
    )
  }
}
