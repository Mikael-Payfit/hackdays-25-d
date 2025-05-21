import { WorkscheduleCalendarRecordAggregate } from '../core/workschedule-calendar-record.aggregate'
import { WorkweekCalendarRecord } from '../core/workschedule-calendar-record.entity'
import { PrivateWorkweekCalendarRecordGeneratedEvent } from './workweek-calendar-record-generated.event'
import { PrivateWorkweekCalendarRecordReGeneratedEvent } from './workweek-calendar-record-regenerated.event'

export function applyWorkweekCalendarRecordGenerated(
  aggregate: WorkscheduleCalendarRecordAggregate,
  event:
    | PrivateWorkweekCalendarRecordGeneratedEvent
    | PrivateWorkweekCalendarRecordReGeneratedEvent,
) {
  aggregate.dataStore.workscheduleCalendarRecord = new WorkweekCalendarRecord({
    id: event.payload.workscheduleCalendarRecordId,
    period: {
      startDate: event.payload.startDate,
      endDate: event.payload.endDate,
    },
    employeeWorkscheduleRegistryId:
      event.payload.employeeWorkscheduleRegistryId,
    employeeWorkscheduleRegistryVersion:
      event.payload.employeeWorkscheduleRegistryVersion,
    workschedulePatternRecordId: event.payload.workschedulePatternRecordId,
    workweekPatternRecord: event.payload.workweekPatternRecord,
    plannedWeek: event.payload.plannedWeek,
  })
}
