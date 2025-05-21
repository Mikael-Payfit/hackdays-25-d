import { Actor } from '../../../../common/models';
import { WorkschedulePatternRegistryAggregate } from '../core';
import { PatternDefinitionInvalidSlotsSizeError } from '../core/errors/pattern-definition-invalid-slots-size.error';
import { PatternNotFoundError } from '../core/errors/pattern-not-found.error';
import { PatternUpdateSameValueError } from '../core/errors/pattern-update-same-value.error';
import {
  WorkweekPatternRecordUpdatedEvent,
  WorkweekPatternRecordUpdatedPayload,
} from './workweek-pattern-updated.event';
import {
  WorkweekPatternDefinition,
  WorkweekPatternRecord,
} from './workweek-pattern.entity';

export type UpdateWorkweekPatternRecordInput = {
  workschedulePatternRecordId: string;
  name: string;
  description: string;
  workschedulePatternDefinition: WorkweekPatternDefinition;
  actor: Actor;
};

export function updateWorkweekPatternRecord(
  aggregate: WorkschedulePatternRegistryAggregate,
  input: UpdateWorkweekPatternRecordInput
): void {
  const pattern = aggregate.dataStore.find(
    (pattern) => pattern.id === input.workschedulePatternRecordId
  ) as WorkweekPatternRecord;
  if (!pattern) {
    throw new PatternNotFoundError();
  }

  if (
    pattern.equals({
      name: input.name,
      description: input.description,
      definition: input.workschedulePatternDefinition,
    })
  ) {
    throw new PatternUpdateSameValueError(pattern.id);
  }

  if (
    WorkweekPatternRecord.hasInvalidSlots(input.workschedulePatternDefinition)
  ) {
    throw new PatternDefinitionInvalidSlotsSizeError(pattern.id);
  }

  aggregate.applyBeforePersist([
    new WorkweekPatternRecordUpdatedEvent(
      aggregate.id,
      new WorkweekPatternRecordUpdatedPayload({
        workschedulePatternRecordId: pattern.id,
        workschedulePatternRegistryId: aggregate.id,
        name: input.name,
        description: input.description,
        definition: input.workschedulePatternDefinition,
        actor: input.actor,
      })
    ),
  ]);
}
