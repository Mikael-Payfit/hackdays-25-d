import {
  BusinessError,
  DatePeriod,
  DatePeriodWithoutEnd,
} from '@payfit/common-time-model'

export class ApplicationPeriodOverlapExistingWorkschedulePatternError extends BusinessError {
  constructor(validityPeriod: DatePeriodWithoutEnd | DatePeriod) {
    super(
      `Application period ${validityPeriod.startDate} ${validityPeriod.endDate} overlaps with existing association`,
    )
  }
}
