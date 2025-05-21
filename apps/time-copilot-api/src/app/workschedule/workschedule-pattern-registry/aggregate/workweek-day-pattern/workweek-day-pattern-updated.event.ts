import {
  EdpBaseEvent,
  EdpBasePayloadEvent,
  EventProducerSchema,
} from '@payfit/edp-sdk';
import { IsDefined, IsNumber, IsUUID } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { WorkschedulePatternRegistryPrivateEventEnum } from '../core/workschedule-pattern-registry-private-event-enum';
import { WorkweekDayPatternDefinition } from './workweek-day-pattern.entity';
import { Actor } from '../../../../common/models';

export interface IWorkweekDayPatternRecordUpdatedPayload {
  workschedulePatternRecordId: string;
  workschedulePatternRegistryId: string;
  name: string;
  description: string;
  definition: WorkweekDayPatternDefinition;
  actor: Actor;
}

@EventProducerSchema({
  eventType:
    WorkschedulePatternRegistryPrivateEventEnum.WORKWEEK_DAY_PATTERN_UPDATED,
  subjectType: 'workschedulePatternRegistry',
  description: ' Workweek Day Pattern Updated Event',
  majorVersion: 1,
  schemaName: 'workweek-day-pattern-updated',
})
export class WorkweekDayPatternRecordUpdatedPayload extends EdpBasePayloadEvent {
  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The workschedulePatternRecordId' })
  public workschedulePatternRecordId: string;

  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The workschedulePatternRegistryId' })
  public workschedulePatternRegistryId: string;

  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The name' })
  public name: string;

  @IsNumber()
  @IsDefined()
  @JSONSchema({ description: 'The description' })
  public description: string;

  @IsDefined()
  @JSONSchema({
    description: 'The definition',
  })
  public definition: WorkweekDayPatternDefinition;

  @IsDefined()
  @JSONSchema({
    description: 'The actor',
  })
  public actor: Actor;

  @IsDefined()
  @JSONSchema({
    description: 'The type',
  })
  public type: 'workweek_full_day';

  constructor(payload: IWorkweekDayPatternRecordUpdatedPayload) {
    super();
    this.workschedulePatternRecordId = payload.workschedulePatternRecordId;
    this.workschedulePatternRegistryId = payload.workschedulePatternRegistryId;
    this.name = payload.name;
    this.description = payload.description;
    this.definition = payload.definition;
    this.actor = payload.actor;
    this.type = 'workweek_full_day';
  }
}

export class WorkweekDayPatternRecordUpdatedEvent extends EdpBaseEvent<WorkweekDayPatternRecordUpdatedPayload> {
  constructor(
    subjectId: string,
    payload: WorkweekDayPatternRecordUpdatedPayload
  ) {
    super({
      subjectId,
      subjectType: 'workschedulePatternRegistry',
      eventDomain: 'HRIS_TIME',
      eventType:
        WorkschedulePatternRegistryPrivateEventEnum.WORKWEEK_DAY_PATTERN_UPDATED,
      payload,
    });
  }
}
