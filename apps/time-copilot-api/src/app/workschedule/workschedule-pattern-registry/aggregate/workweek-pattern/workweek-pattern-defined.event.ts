import {
  EdpBaseEvent,
  EdpBasePayloadEvent,
  EventProducerSchema,
} from '@payfit/edp-sdk';
import { IsDefined, IsNumber, IsUUID } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { WorkschedulePatternRegistryPrivateEventEnum } from '../core/workschedule-pattern-registry-private-event-enum';
import { WorkweekPatternDefinition } from './workweek-pattern.entity';
import { Actor } from '../../../../common/models';

export interface IWorkweekPatternRecordDefinedPayload {
  workschedulePatternRecordId: string;
  workschedulePatternRegistryId: string;
  name: string;
  description: string;
  definition: WorkweekPatternDefinition;
  actor: Actor;
}

@EventProducerSchema({
  eventType:
    WorkschedulePatternRegistryPrivateEventEnum.WORKWEEK_PATTERN_DEFINED,
  subjectType: 'workschedulePatternRegistry',
  description: ' Workweek Pattern Defined Event',
  majorVersion: 2,
  schemaName: 'workweek-pattern-defined',
})
export class WorkweekPatternRecordDefinedPayload extends EdpBasePayloadEvent {
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
  public definition: WorkweekPatternDefinition;

  @IsDefined()
  @JSONSchema({
    description: 'The actor',
  })
  public actor: Actor;

  @IsDefined()
  @JSONSchema({
    description: 'The type',
  })
  public type: 'workweek_time_slots';

  constructor(payload: IWorkweekPatternRecordDefinedPayload) {
    super();
    this.workschedulePatternRecordId = payload.workschedulePatternRecordId;
    this.workschedulePatternRegistryId = payload.workschedulePatternRegistryId;
    this.name = payload.name;
    this.description = payload.description;
    this.definition = payload.definition;
    this.actor = payload.actor;
    this.type = 'workweek_time_slots';
  }
}

export class WorkweekPatternRecordDefinedEvent extends EdpBaseEvent<WorkweekPatternRecordDefinedPayload> {
  constructor(subjectId: string, payload: WorkweekPatternRecordDefinedPayload) {
    super({
      subjectId,
      subjectType: 'workschedulePatternRegistry',
      eventDomain: 'HRIS_TIME',
      eventType:
        WorkschedulePatternRegistryPrivateEventEnum.WORKWEEK_PATTERN_DEFINED,
      payload,
    });
  }
}
