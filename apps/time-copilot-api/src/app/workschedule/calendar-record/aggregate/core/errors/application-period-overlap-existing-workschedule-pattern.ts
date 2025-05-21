import { BusinessError } from '../../../../../common/errors';
import { DatePeriodWithoutEnd } from '../../../../../common/models';

export class ApplicationPeriodOverlapExistingWorkschedulePatternError extends BusinessError {
  constructor(applicationPeriod: DatePeriodWithoutEnd) {
    super(
      `Application period ${applicationPeriod.startDate} ${applicationPeriod.endDate} overlaps with existing association`
    );
  }
}
