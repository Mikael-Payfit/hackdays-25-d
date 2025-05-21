import { IsDefined, IsNumber, IsUUID } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

import {
  EdpBaseEvent,
  EdpBasePayloadEvent,
  EventProducerSchema,
} from '@payfit/edp-sdk';

import { LeaveRegistryPrivateEventsEnum } from '../core/leave-registry-private-events.enum';
import { Actor } from '../../../common/models';

export interface IUpdateLeavePeriodPreapprovedPayload {
  submissionId: string;
  leaveRegistryId: string;
  leaveRegistryVersion: number;
  actor: Actor;
}

@EventProducerSchema({
  eventType: LeaveRegistryPrivateEventsEnum.UPDATE_LEAVE_PERIOD_PREAPPROVED,
  subjectType: 'leaveRegistry',
  description: 'Update Period Preapproved',
  majorVersion: 1,
  schemaName: 'update-leave-period-preapproved',
})
export class UpdateLeavePeriodPreapprovedPayload extends EdpBasePayloadEvent {
  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The submission id' })
  public submissionId: string;

  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The leaveRegistry id' })
  public leaveRegistryId: string;

  @IsNumber()
  @IsDefined()
  @JSONSchema({ description: 'The leave registry version' })
  public leaveRegistryVersion: number;

  @IsDefined()
  @JSONSchema({
    description:
      'The actor who registered the preapproved update-leave-period submission (id, name & role fields)',
  })
  public actor: Actor;

  constructor(payload: IUpdateLeavePeriodPreapprovedPayload) {
    super();
    this.submissionId = payload.submissionId;
    this.leaveRegistryId = payload.leaveRegistryId;
    this.leaveRegistryVersion = payload.leaveRegistryVersion;
    this.actor = payload.actor;
  }
}

export class UpdateLeavePeriodPreapprovedEvent extends EdpBaseEvent<UpdateLeavePeriodPreapprovedPayload> {
  constructor(subjectId: string, payload: UpdateLeavePeriodPreapprovedPayload) {
    super({
      subjectId,
      eventDomain: 'HRIS_TIME',
      eventType: LeaveRegistryPrivateEventsEnum.UPDATE_LEAVE_PERIOD_PREAPPROVED,
      payload,
    });
  }
}
