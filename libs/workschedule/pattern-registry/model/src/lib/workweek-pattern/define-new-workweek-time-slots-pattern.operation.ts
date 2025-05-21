import { Actor, generateNewEntityId } from '@payfit/common-time-model'
import { WorkschedulePatternRegistryAggregate } from '../core'
import { PatternDefinitionInvalidSlotsSizeError } from '../core/errors/pattern-definition-invalid-slots-size.error'
import {
  WorkweekPatternRecordDefinedEvent,
  WorkweekPatternRecordDefinedPayload,
} from './workweek-pattern-defined.event'
import {
  WorkweekPatternDefinition,
  WorkweekPatternRecord,
} from './workweek-pattern.entity'

export type DefineNewWorkweekTimeSlotsPatternRecordInput = {
  name: string
  description: string
  workschedulePatternDefinition: WorkweekPatternDefinition
  actor: Actor
}

export type DefineNewWorkweekTimeSlotsPatternRecordOutput = {
  workschedulePatternRecordId: string
}

export function defineNewWorkweekTimeSlotsPatternRecord(
  aggregate: WorkschedulePatternRegistryAggregate,
  input: DefineNewWorkweekTimeSlotsPatternRecordInput,
): DefineNewWorkweekTimeSlotsPatternRecordOutput {
  if (
    WorkweekPatternRecord.hasInvalidSlots(input.workschedulePatternDefinition)
  ) {
    throw new PatternDefinitionInvalidSlotsSizeError()
  }
  const workschedulePatternRecordId = generateNewEntityId()

  aggregate.applyBeforePersist([
    new WorkweekPatternRecordDefinedEvent(
      aggregate.id,
      new WorkweekPatternRecordDefinedPayload({
        workschedulePatternRecordId,
        workschedulePatternRegistryId: aggregate.id,
        name: input.name,
        description: input.description,
        definition: input.workschedulePatternDefinition,
        actor: input.actor,
      }),
    ),
  ])

  return { workschedulePatternRecordId }
}
