import {
  DatePeriodHelper,
  DatePeriodWithoutEnd,
  ISOFormatDate,
} from '@payfit/common-time-model'

export type WorkschedulePatternAssociation = {
  workschedulePatternRegistryId: string
  workschedulePatternRegistryVersion: number
  workschedulePatternRecordId: string
  validityPeriod: DatePeriodWithoutEnd
}

export class WorkschedulePatternAssociationHelper {
  public static getCurrentEffectiveAssociation(
    associations: WorkschedulePatternAssociation[],
  ): WorkschedulePatternAssociation | undefined {
    return associations.find((association) => {
      const date = new Date().toISOString() as ISOFormatDate

      const period = association.validityPeriod
      const datePeriod = { startDate: date, endDate: date }
      return (
        !DatePeriodHelper.isBefore(datePeriod, period) &&
        !DatePeriodHelper.isAfter(datePeriod, period)
      )
    })
  }
}
