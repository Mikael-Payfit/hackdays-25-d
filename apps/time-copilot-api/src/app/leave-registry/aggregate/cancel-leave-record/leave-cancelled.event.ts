import {
  EdpBaseEvent,
  EdpBasePayloadEvent,
  EventProducerSchema,
} from '@payfit/edp-sdk';
import { IsDefined, IsNumber, IsUUID } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { LeaveRegistryPrivateEventsEnum } from '../core/leave-registry-private-events.enum';
import { Actor } from '../../../common/models';

export interface ILeaveCancelledPayload {
  leaveRecordId: string;
  submissionId: string;
  leaveRegistryId: string;
  leaveRegistryVersion: number;
  actor: Actor;
}

@EventProducerSchema({
  eventType: LeaveRegistryPrivateEventsEnum.LEAVE_CANCELLED,
  subjectType: 'leaveRegistry',
  description: 'Leave cancelled',
  majorVersion: 2,
  schemaName: 'leave-cancelled',
})
export class LeaveCancelledPayload extends EdpBasePayloadEvent {
  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The leave record id' })
  public leaveRecordId: string;

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
    description: 'The actor who cancelled the leave (id, name & role fields)',
  })
  public actor: Actor;

  constructor(payload: ILeaveCancelledPayload) {
    super();
    this.leaveRecordId = payload.leaveRecordId;
    this.submissionId = payload.submissionId;
    this.leaveRegistryId = payload.leaveRegistryId;
    this.leaveRegistryVersion = payload.leaveRegistryVersion;
    this.actor = payload.actor;
  }
}

export class LeaveCancelledEvent extends EdpBaseEvent<LeaveCancelledPayload> {
  constructor(subjectId: string, payload: LeaveCancelledPayload) {
    super({
      subjectId,
      eventDomain: 'HRIS_TIME',
      eventType: LeaveRegistryPrivateEventsEnum.LEAVE_CANCELLED,
      payload,
    });
  }
}
