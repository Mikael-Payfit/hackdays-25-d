import { WeekDay } from '@payfit/common-time-model'
import { isEqual } from 'lodash'
import { WorkschedulePatternRecord } from '../core/workschedule-pattern.entity'

export type WeekHalfDayBasicDefinition = {
  isJourOuvre: boolean
  isJourOuvrable: boolean
  morning: {
    planned: boolean
  }
  afternoon: {
    planned: boolean
  }
}

export type WorkweekHalfDaysPatternDefinition = Record<
  WeekDay,
  WeekHalfDayBasicDefinition
>

export interface IWorkweekHalfDaysPatternRecord {
  id: string
  name: string
  description: string
  definition: WorkweekHalfDaysPatternDefinition
}

export class WorkweekHalfDaysPatternRecord
  extends WorkschedulePatternRecord
  implements IWorkweekHalfDaysPatternRecord
{
  public definition: WorkweekHalfDaysPatternDefinition

  constructor({
    id,
    name,
    description,
    definition,
  }: {
    id: string
    name: string
    description: string
    definition: WorkweekHalfDaysPatternDefinition
  }) {
    super(id, name, description)
    this.definition = definition
  }

  public equals(workweekDayPattern: {
    name: string
    description: string
    definition: WorkweekHalfDaysPatternDefinition
  }): boolean {
    return (
      this.name === workweekDayPattern.name &&
      this.description === workweekDayPattern.description &&
      isEqual(this.definition, workweekDayPattern.definition)
    )
  }
}
