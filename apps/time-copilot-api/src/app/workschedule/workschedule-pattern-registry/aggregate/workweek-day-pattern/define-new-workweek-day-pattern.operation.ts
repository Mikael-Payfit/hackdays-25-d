import { generateNewEntityId } from '../../../../common/helpers/uuid';
import { Actor } from '../../../../common/models';
import {
  PatternNameAlreadyExistError,
  WorkschedulePatternRegistryAggregate,
} from '../core';
import {
  WorkweekDayPatternRecordDefinedEvent,
  WorkweekDayPatternRecordDefinedPayload,
} from './workweek-day-pattern-defined.event';
import { WorkweekDayPatternDefinition } from './workweek-day-pattern.entity';

export type DefineNewWorkweekDayPatternRecordInput = {
  name: string;
  description: string;
  workweekDayPatternDefinition: WorkweekDayPatternDefinition;
  actor: Actor;
};

export type DefineNewWorkweekDayPatternRecordOutput = {
  workschedulePatternRecordId: string;
};

export function defineNewWorkweekDayPatternRecord(
  aggregate: WorkschedulePatternRegistryAggregate,
  input: DefineNewWorkweekDayPatternRecordInput
): DefineNewWorkweekDayPatternRecordOutput {
  if (aggregate.dataStore.find((pattern) => pattern.name === input.name)) {
    throw new PatternNameAlreadyExistError(input.name);
  }
  const workschedulePatternRecordId = generateNewEntityId();

  aggregate.applyBeforePersist([
    new WorkweekDayPatternRecordDefinedEvent(
      aggregate.id,
      new WorkweekDayPatternRecordDefinedPayload({
        workschedulePatternRecordId,
        workschedulePatternRegistryId: aggregate.id,
        name: input.name,
        description: input.description,
        definition: input.workweekDayPatternDefinition,
        actor: input.actor,
      })
    ),
  ]);

  return { workschedulePatternRecordId };
}
