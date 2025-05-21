import { BusinessError, DatePeriodWithoutEnd } from '@payfit/common-time-model'

export class ApplicationPeriodOverlapExistingWorkschedulePatternError extends BusinessError {
  constructor(applicationPeriod: DatePeriodWithoutEnd) {
    super(
      `Application period ${applicationPeriod.startDate} ${applicationPeriod.endDate} overlaps with existing association`,
    )
  }
}
