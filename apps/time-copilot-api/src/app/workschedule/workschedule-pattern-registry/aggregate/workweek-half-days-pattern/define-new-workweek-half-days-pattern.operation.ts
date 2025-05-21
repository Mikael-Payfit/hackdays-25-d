import { generateNewEntityId } from '../../../../common/helpers/uuid';
import { Actor } from '../../../../common/models';
import { WorkschedulePatternRegistryAggregate } from '../core';
import {
  WorkweekHalfDaysPatternRecordDefinedEvent,
  WorkweekHalfDaysPatternRecordDefinedPayload,
} from './workweek-half-days-pattern-defined.event';
import { WorkweekHalfDaysPatternDefinition } from './workweek-half-days-pattern.entity';

export type DefineNewWorkweekHalfDaysPatternRecordInput = {
  name: string;
  description: string;
  workweekHalfDaysPatternDefinition: WorkweekHalfDaysPatternDefinition;
  actor: Actor;
};

export type DefineNewWorkweekHalfDaysPatternRecordOutput = {
  workschedulePatternRecordId: string;
};

export function defineNewWorkweekHalfDaysPatternRecord(
  aggregate: WorkschedulePatternRegistryAggregate,
  input: DefineNewWorkweekHalfDaysPatternRecordInput
): DefineNewWorkweekHalfDaysPatternRecordOutput {
  const workschedulePatternRecordId = generateNewEntityId();

  aggregate.applyBeforePersist([
    new WorkweekHalfDaysPatternRecordDefinedEvent(
      aggregate.id,
      new WorkweekHalfDaysPatternRecordDefinedPayload({
        workschedulePatternRecordId,
        workschedulePatternRegistryId: aggregate.id,
        name: input.name,
        description: input.description,
        definition: input.workweekHalfDaysPatternDefinition,
        actor: input.actor,
      })
    ),
  ]);

  return { workschedulePatternRecordId };
}
