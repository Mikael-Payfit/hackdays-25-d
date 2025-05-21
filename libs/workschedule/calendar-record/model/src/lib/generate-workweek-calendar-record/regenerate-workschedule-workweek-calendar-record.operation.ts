import {
  WorkscheduleCalendarRecordAggregate,
  WorkweekCalendarRecord,
} from '../core'
import { PlannedWeekDay } from '../core/calendar-record.value-objects'
import {
  generatePlannedWeek,
  GenerateWorkscheduleWorkweekCalendarRecordInput,
} from './generate-workschedule-workweek-calendar-record.operation'
import {
  PrivateWorkweekCalendarRecordReGeneratedEvent,
  PrivateWorkweekCalendarRecordReGeneratedPayload,
} from './workweek-calendar-record-regenerated.event'

export function regenerateWorkscheduleCalendarRecord(
  aggregate: WorkscheduleCalendarRecordAggregate,
  input: GenerateWorkscheduleWorkweekCalendarRecordInput,
): void {
  const plannedWeek: PlannedWeekDay[] = generatePlannedWeek({
    country: input.country,
    startDate: input.startDate,
    endDate: input.endDate,
    workweekPatternRecord: input.workweekPatternRecord,
    companyWeekParams: input.companyWeekParams,
    publicHolidays: input.publicHolidays,
  })

  let isDif = false
  if (
    aggregate.dataStore.workscheduleCalendarRecord &&
    aggregate.dataStore.workscheduleCalendarRecord instanceof
      WorkweekCalendarRecord
  ) {
    const newWorkweek = new WorkweekCalendarRecord({
      id: aggregate.id,
      period: {
        startDate: input.startDate,
        endDate: input.endDate,
      },
      employeeWorkscheduleRegistryId: input.employeeWorkscheduleRegistryId,
      employeeWorkscheduleRegistryVersion:
        input.employeeWorkscheduleRegistryVersion,
      workschedulePatternRecordId: input.workschedulePatternRecordId,
      workweekPatternRecord: input.workweekPatternRecord,
      plannedWeek,
    })
    if (!newWorkweek.isEqual(aggregate.dataStore.workscheduleCalendarRecord)) {
      isDif = true
    }
  }

  if (isDif) {
    aggregate.applyBeforePersist([
      new PrivateWorkweekCalendarRecordReGeneratedEvent(
        aggregate.id,
        new Date(input.startDate).getTime(),
        new PrivateWorkweekCalendarRecordReGeneratedPayload({
          employeeWorkscheduleRegistryIdWithPeriodPartitionKey: `${input.employeeWorkscheduleRegistryId}_${input.startDate}_${input.endDate}`,
          country: input.country,
          workscheduleCalendarRecordId: aggregate.id,
          employeeWorkscheduleRegistryId: input.employeeWorkscheduleRegistryId,
          employeeWorkscheduleRegistryVersion:
            input.employeeWorkscheduleRegistryVersion,
          workschedulePatternRecordId: input.workschedulePatternRecordId,
          workweekPatternRecord: input.workweekPatternRecord,
          plannedWeek,
          startDate: input.startDate,
          endDate: input.endDate,
          actor: input.actor,
        }),
      ),
    ])
  }
}
