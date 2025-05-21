import { Actor } from '../../../../common/models';
import { WorkschedulePatternRegistryAggregate } from '../core';
import { PatternNotFoundError } from '../core/errors/pattern-not-found.error';
import { PatternUpdateSameValueError } from '../core/errors/pattern-update-same-value.error';
import {
  WorkweekHalfDaysPatternRecordUpdatedEvent,
  WorkweekHalfDaysPatternRecordUpdatedPayload,
} from './workweek-half-days-pattern-updated.event';
import {
  WorkweekHalfDaysPatternDefinition,
  WorkweekHalfDaysPatternRecord,
} from './workweek-half-days-pattern.entity';

export type UpdateWorkweekHalfDaysPatternRecordInput = {
  workschedulePatternRecordId: string;
  name: string;
  description: string;
  workweekHalfDaysPatternDefinition: WorkweekHalfDaysPatternDefinition;
  actor: Actor;
};

export function updateWorkweekHalfDaysPatternRecord(
  aggregate: WorkschedulePatternRegistryAggregate,
  input: UpdateWorkweekHalfDaysPatternRecordInput
): void {
  const pattern = aggregate.dataStore.find(
    (pattern) => pattern.id === input.workschedulePatternRecordId
  ) as WorkweekHalfDaysPatternRecord;
  if (!pattern) {
    throw new PatternNotFoundError();
  }

  if (
    pattern.equals({
      name: input.name,
      description: input.description,
      definition: input.workweekHalfDaysPatternDefinition,
    })
  ) {
    throw new PatternUpdateSameValueError(pattern.id);
  }

  aggregate.applyBeforePersist([
    new WorkweekHalfDaysPatternRecordUpdatedEvent(
      aggregate.id,
      new WorkweekHalfDaysPatternRecordUpdatedPayload({
        workschedulePatternRecordId: pattern.id,
        workschedulePatternRegistryId: aggregate.id,
        name: input.name,
        description: input.description,
        definition: input.workweekHalfDaysPatternDefinition,
        actor: input.actor,
      })
    ),
  ]);
}
