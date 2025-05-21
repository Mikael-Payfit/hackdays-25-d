import { BusinessError } from '../../../../common/errors';

export class InvalidLeavePeriodError extends BusinessError {
  constructor(periodValidationErrors: string[]) {
    super(`Invalid leave period: ${periodValidationErrors.join(', ')}`);
  }
}
