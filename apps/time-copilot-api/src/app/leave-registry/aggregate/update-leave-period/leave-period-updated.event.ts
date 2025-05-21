import {
  EdpBaseEvent,
  EdpBasePayloadEvent,
  EventProducerSchema,
} from '@payfit/edp-sdk';
import { IsDefined, IsNumber, IsString, IsUUID } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { Actor, ISOFormatDate, MomentOfDay } from '../../../common/models';
import { LeaveRegistryPrivateEventsEnum } from '../core/leave-registry-private-events.enum';

export interface ILeavePeriodUpdatedPayload {
  leaveRecordId: string;
  submissionId: string;
  leaveRegistryId: string;
  leaveRegistryVersion: number;
  actor: Actor;
  newBeginDate: ISOFormatDate;
  newBeginMoment: MomentOfDay;
  newEndDate: ISOFormatDate;
  newEndMoment: MomentOfDay;
}

@EventProducerSchema({
  eventType: LeaveRegistryPrivateEventsEnum.LEAVE_PERIOD_UPDATED,
  subjectType: 'leaveRegistry',
  description: 'Leave period modified',
  majorVersion: 2,
  schemaName: 'leave-update-leave-period',
})
export class LeavePeriodUpdatedPayload extends EdpBasePayloadEvent {
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
    description:
      'The actor who modified the leave period (id, name & role fields)',
  })
  public actor: Actor;

  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The new begin date' })
  public newBeginDate: string;

  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The new begin moment' })
  public newBeginMoment: string;

  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The new end date' })
  public newEndDate: string;

  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The new end moment' })
  public newEndMoment: string;

  constructor(payload: ILeavePeriodUpdatedPayload) {
    super();
    this.leaveRecordId = payload.leaveRecordId;
    this.submissionId = payload.submissionId;
    this.leaveRegistryId = payload.leaveRegistryId;
    this.leaveRegistryVersion = payload.leaveRegistryVersion;
    this.actor = payload.actor;
    this.newBeginDate = payload.newBeginDate;
    this.newBeginMoment = payload.newBeginMoment;
    this.newEndDate = payload.newEndDate;
    this.newEndMoment = payload.newEndMoment;
  }
}

export class LeavePeriodUpdatedEvent extends EdpBaseEvent<LeavePeriodUpdatedPayload> {
  constructor(subjectId: string, payload: LeavePeriodUpdatedPayload) {
    super({
      subjectId,
      eventDomain: 'HRIS_TIME',
      eventType: LeaveRegistryPrivateEventsEnum.LEAVE_PERIOD_UPDATED,
      payload,
    });
  }
}
