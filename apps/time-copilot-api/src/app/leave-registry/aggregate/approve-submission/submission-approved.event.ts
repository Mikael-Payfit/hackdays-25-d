import {
  EdpBaseEvent,
  EdpBasePayloadEvent,
  EventProducerSchema,
} from '@payfit/edp-sdk';
import { IsDefined, IsNumber, IsUUID } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { Actor } from '../../../common/models';
import { LeaveRegistryPrivateEventsEnum } from '../core/leave-registry-private-events.enum';

export interface ISubmissionApprovedPayload {
  submissionId: string;
  leaveRegistryId: string;
  leaveRegistryVersion: number;
  actor: Actor;
}

@EventProducerSchema({
  eventType: LeaveRegistryPrivateEventsEnum.SUBMISSION_APPROVED,
  subjectType: 'leaveRegistry',
  description: 'Submission approved',
  majorVersion: 2,
  schemaName: 'submission-approved',
})
export class SubmissionApprovedPayload extends EdpBasePayloadEvent {
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
      'The actor who approved the submission (id, name & role fields)',
  })
  public actor: Actor;

  constructor(payload: ISubmissionApprovedPayload) {
    super();
    this.submissionId = payload.submissionId;
    this.leaveRegistryId = payload.leaveRegistryId;
    this.leaveRegistryVersion = payload.leaveRegistryVersion;
    this.actor = payload.actor;
  }
}

export class SubmissionApprovedEvent extends EdpBaseEvent<SubmissionApprovedPayload> {
  constructor(subjectId: string, payload: SubmissionApprovedPayload) {
    super({
      subjectId,
      eventDomain: 'HRIS_TIME',
      eventType: LeaveRegistryPrivateEventsEnum.SUBMISSION_APPROVED,
      payload,
    });
  }
}
