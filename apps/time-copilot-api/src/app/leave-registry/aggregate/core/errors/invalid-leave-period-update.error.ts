import { BusinessError } from '../../../../common/errors';

export class InvalidLeavePeriodUpdateError extends BusinessError {
  constructor(periodUpdateValidationErrors: string[]) {
    super(
      `Invalid leave period update: ${periodUpdateValidationErrors.join(', ')}`
    );
  }
}
