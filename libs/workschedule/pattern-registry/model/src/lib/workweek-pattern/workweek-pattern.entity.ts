import { WeekDay, WeekDayDefinition } from '@payfit/common-time-model'
import { isEqual } from 'lodash'
import { WorkschedulePatternRecord } from '../core/workschedule-pattern.entity'

export type WorkweekPatternType =
  | 'workweek_full_day'
  | 'workweek_half_day'
  | 'workweek_time_slots'

export type WorkweekPatternDefinition = Record<WeekDay, WeekDayDefinition>

export interface IWorkweekPatternRecord {
  id: string
  name: string
  description: string
  definition: WorkweekPatternDefinition
}

export class WorkweekPatternRecord
  extends WorkschedulePatternRecord
  implements IWorkweekPatternRecord
{
  public definition: WorkweekPatternDefinition

  constructor({
    id,
    name,
    description,
    definition,
  }: {
    id: string
    name: string
    description: string
    definition: WorkweekPatternDefinition
  }) {
    super(id, name, description)
    this.definition = definition
  }

  public equals(workweekPattern: {
    name: string
    description: string
    definition: WorkweekPatternDefinition
  }): boolean {
    return (
      this.name === workweekPattern.name &&
      this.description === workweekPattern.description &&
      isEqual(this.definition, workweekPattern.definition)
    )
  }

  public static hasInvalidSlots(
    definition: WorkweekPatternDefinition,
  ): boolean {
    const daysOfWeek = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ] as WeekDay[]
    return daysOfWeek.some((day) => definition[day].timeslots.length > 2)
  }
}
