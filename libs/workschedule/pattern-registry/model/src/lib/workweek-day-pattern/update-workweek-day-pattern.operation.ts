import { Actor } from '@payfit/common-time-model'
import { WorkschedulePatternRegistryAggregate } from '../core'
import { PatternNotFoundError } from '../core/errors/pattern-not-found.error'
import { PatternUpdateSameValueError } from '../core/errors/pattern-update-same-value.error'
import {
  WorkweekDayPatternRecordUpdatedEvent,
  WorkweekDayPatternRecordUpdatedPayload,
} from './workweek-day-pattern-updated.event'
import {
  WorkweekDayPatternDefinition,
  WorkweekDayPatternRecord,
} from './workweek-day-pattern.entity'

export type UpdateWorkweekDayPatternRecordInput = {
  workschedulePatternRecordId: string
  name: string
  description: string
  workweekDayPatternDefinition: WorkweekDayPatternDefinition
  actor: Actor
}

export function updateWorkweekDayPatternRecord(
  aggregate: WorkschedulePatternRegistryAggregate,
  input: UpdateWorkweekDayPatternRecordInput,
): void {
  const pattern = aggregate.dataStore.find(
    (pattern) => pattern.id === input.workschedulePatternRecordId,
  ) as WorkweekDayPatternRecord
  if (!pattern) {
    throw new PatternNotFoundError()
  }

  if (
    pattern.equals({
      name: input.name,
      description: input.description,
      definition: input.workweekDayPatternDefinition,
    })
  ) {
    throw new PatternUpdateSameValueError(pattern.id)
  }

  aggregate.applyBeforePersist([
    new WorkweekDayPatternRecordUpdatedEvent(
      aggregate.id,
      new WorkweekDayPatternRecordUpdatedPayload({
        workschedulePatternRecordId: pattern.id,
        workschedulePatternRegistryId: aggregate.id,
        name: input.name,
        description: input.description,
        definition: input.workweekDayPatternDefinition,
        actor: input.actor,
      }),
    ),
  ])
}
