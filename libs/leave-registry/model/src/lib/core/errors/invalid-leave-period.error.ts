import { BusinessError } from '@payfit/common-time-model'

export class InvalidLeavePeriodError extends BusinessError {
  constructor(periodValidationErrors: string[]) {
    super(`Invalid leave period: ${periodValidationErrors.join(', ')}`)
  }
}
