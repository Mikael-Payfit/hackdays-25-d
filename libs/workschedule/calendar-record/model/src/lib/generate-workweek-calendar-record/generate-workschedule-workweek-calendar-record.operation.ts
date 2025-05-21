import { Actor, ISOFormatDate, WeekDay } from '@payfit/common-time-model'
import {
  CompanyDayParams,
  defaultLunchBreakTimeSlot,
} from '@payfit/workschedule/company-digest-model'
import { WorkweekPatternRecord } from '@payfit/workschedule/pattern-registry-model'
import { addDays, format, parseISO } from 'date-fns'
import {
  PrivateWorkweekCalendarRecordGeneratedEvent,
  PrivateWorkweekCalendarRecordGeneratedPayload,
  WorkscheduleCalendarRecordAggregate,
  WorkscheduleCalendarRecordInitializedEvent,
  WorkscheduleCalendarRecordInitializedPayload,
} from '../core'
import { PlannedWeekDay } from '../core/calendar-record.value-objects'

export type GenerateWorkscheduleWorkweekCalendarRecordInput = {
  country: string
  employeeWorkscheduleRegistryId: string
  employeeWorkscheduleRegistryVersion: number
  workschedulePatternRecordId: string
  workweekPatternRecord: WorkweekPatternRecord
  companyWeekParams: CompanyDayParams[]
  publicHolidays: Record<ISOFormatDate, string>
  startDate: ISOFormatDate
  endDate: ISOFormatDate
  actor: Actor
}

export function generateWorkscheduleCalendarRecord(
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

  aggregate.applyBeforePersist([
    new WorkscheduleCalendarRecordInitializedEvent(
      aggregate.id,
      new Date(input.startDate).getTime(),
      new WorkscheduleCalendarRecordInitializedPayload({
        employeeWorkscheduleRegistryIdWithPeriodPartitionKey: `${input.employeeWorkscheduleRegistryId}_${input.startDate}_${input.endDate}`,
        workscheduleCalendarRecordId: aggregate.id,
      }),
    ),
    new PrivateWorkweekCalendarRecordGeneratedEvent(
      aggregate.id,
      new Date(input.startDate).getTime() + 1,
      new PrivateWorkweekCalendarRecordGeneratedPayload({
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

export function generatePlannedWeek(input: {
  country: string
  startDate: string
  endDate: string
  workweekPatternRecord: WorkweekPatternRecord
  companyWeekParams: CompanyDayParams[]
  publicHolidays: Record<ISOFormatDate, string>
}): PlannedWeekDay[] {
  let startDate = parseISO(input.startDate)
  const endDate = parseISO(input.endDate)

  const plannedWeek: PlannedWeekDay[] = []

  while (startDate <= endDate) {
    const day = format(startDate, 'EEEE').toLowerCase() as WeekDay
    const dayDefinition = input.workweekPatternRecord.definition[day]
    const companyDefinition = input.companyWeekParams.find(
      (cp) => cp.day === day,
    )
    const lunchBreakTimeSlot =
      companyDefinition?.lunchBreakTimeSlot ?? defaultLunchBreakTimeSlot
    const date = format(startDate, 'yyyy-MM-dd') as ISOFormatDate

    plannedWeek.push({
      date,
      day,
      lunchBreakTimeSlot,
      isPublicHoliday: Boolean(input.publicHolidays[date]),
      timeslots: dayDefinition.timeslots,
      isJourOuvrable: dayDefinition.isJourOuvrable,
      isJourOuvre: dayDefinition.isJourOuvre,
    })

    startDate = addDays(startDate, 1)
  }
  return plannedWeek
}
