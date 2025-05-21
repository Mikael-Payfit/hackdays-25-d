import { AggregateRepository, ISOFormatDate } from '@payfit/common-time-model'

import { WorkscheduleCalendarRecordAggregate } from './workschedule-calendar-record.aggregate'

export const WORKSCHEDULE_CALENDAR_RECORD_REPOSITORY =
  'WORKSCHEDULE_CALENDAR_RECORD_REPOSITORY'

export interface IWorkscheduleCalendarRecordRepository
  extends AggregateRepository<WorkscheduleCalendarRecordAggregate> {
  resetWorkscheduleCalendarRecord(
    workscheduleCalendarRecordId: string,
  ): Promise<void>
  save(aggregate: WorkscheduleCalendarRecordAggregate): Promise<void>
  getByIdOrThrow(
    workscheduleCalendarRecordId: string,
  ): Promise<WorkscheduleCalendarRecordAggregate>
  getByEmployeeWorkscheduleRegistryId(input: {
    employeeWorkscheduleRegistryId: string
    startDate: ISOFormatDate
    endDate: ISOFormatDate
  }): Promise<WorkscheduleCalendarRecordAggregate | undefined>
}
