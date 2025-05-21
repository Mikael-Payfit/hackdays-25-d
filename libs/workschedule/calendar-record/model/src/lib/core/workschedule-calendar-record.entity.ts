import { DatePeriod, Entity } from '@payfit/common-time-model'
import {
  WorkschedulePatternRecord,
  WorkweekPatternRecord,
} from '@payfit/workschedule/pattern-registry-model'
import { isEqual } from 'lodash'
import { PlannedWeekDay } from './calendar-record.value-objects'

export class WorkscheduleCalendarRecord extends Entity {
  public period: DatePeriod
  public employeeWorkscheduleRegistryId: string
  public employeeWorkscheduleRegistryVersion: number
  public workschedulePatternRecordId: string
  public workschedulePatternRecord: WorkschedulePatternRecord

  constructor({
    id,
    period,
    employeeWorkscheduleRegistryId,
    employeeWorkscheduleRegistryVersion,
    workschedulePatternRecordId,
    workschedulePatternRecord,
  }: {
    id: string
    period: DatePeriod
    employeeWorkscheduleRegistryId: string
    employeeWorkscheduleRegistryVersion: number
    workschedulePatternRecordId: string
    workschedulePatternRecord: WorkschedulePatternRecord
  }) {
    super(id)
    this.period = period
    this.employeeWorkscheduleRegistryId = employeeWorkscheduleRegistryId
    this.employeeWorkscheduleRegistryVersion =
      employeeWorkscheduleRegistryVersion
    this.workschedulePatternRecordId = workschedulePatternRecordId
    this.workschedulePatternRecord = workschedulePatternRecord
  }
}

export class WorkweekCalendarRecord extends WorkscheduleCalendarRecord {
  plannedWeek: PlannedWeekDay[]

  constructor({
    id,
    period,
    employeeWorkscheduleRegistryId,
    employeeWorkscheduleRegistryVersion,
    workschedulePatternRecordId,
    workweekPatternRecord,
    plannedWeek,
  }: {
    id: string
    period: DatePeriod
    employeeWorkscheduleRegistryId: string
    employeeWorkscheduleRegistryVersion: number
    workschedulePatternRecordId: string
    workweekPatternRecord: WorkweekPatternRecord
    plannedWeek: PlannedWeekDay[]
  }) {
    super({
      id,
      period,
      employeeWorkscheduleRegistryId,
      employeeWorkscheduleRegistryVersion,
      workschedulePatternRecordId,
      workschedulePatternRecord: workweekPatternRecord,
    })
    this.plannedWeek = plannedWeek
  }

  get workweekPatternRecord(): WorkweekPatternRecord {
    return this.workschedulePatternRecord as WorkweekPatternRecord
  }

  isEqual(otherWorkweek: WorkweekCalendarRecord): boolean {
    if (this.id !== otherWorkweek.id) return false
    if (this.period.startDate !== otherWorkweek.period.startDate) return false
    if (this.period.endDate !== otherWorkweek.period.endDate) return false
    if (!isEqual(this.period, otherWorkweek.period)) return false
    if (!isEqual(this.plannedWeek, otherWorkweek.plannedWeek)) return false
    if (
      this.workschedulePatternRecordId !==
      otherWorkweek.workschedulePatternRecordId
    )
      return false

    return true
  }
}
