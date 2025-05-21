import { Actor } from '@payfit/common-time-model'
import {
  EdpBaseEvent,
  EdpBasePayloadEvent,
  EventProducerSchema,
} from '@payfit/edp-sdk'
import { IsDefined, IsNumber, IsUUID } from 'class-validator'
import { JSONSchema } from 'class-validator-jsonschema'
import { LeaveRegistryPrivateEventsEnum } from '../core/leave-registry-private-events.enum'

export interface ISubmissionDeclinedPayload {
  submissionId: string
  leaveRegistryId: string
  leaveRegistryVersion: number
  actor: Actor
}

@EventProducerSchema({
  eventType: LeaveRegistryPrivateEventsEnum.SUBMISSION_DECLINED,
  subjectType: 'leaveRegistry',
  description: 'Submission declined',
  majorVersion: 2,
  schemaName: 'submission-declined',
})
export class SubmissionDeclinedPayload extends EdpBasePayloadEvent {
  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The submission id' })
  public submissionId: string

  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The leaveRegistry id' })
  public leaveRegistryId: string

  @IsNumber()
  @IsDefined()
  @JSONSchema({ description: 'The leave registry version' })
  public leaveRegistryVersion: number

  @IsDefined()
  @JSONSchema({
    description:
      'The actor who declined the submission (id, name & role fields)',
  })
  public actor: Actor

  constructor(payload: ISubmissionDeclinedPayload) {
    super()
    this.submissionId = payload.submissionId
    this.leaveRegistryId = payload.leaveRegistryId
    this.leaveRegistryVersion = payload.leaveRegistryVersion
    this.actor = payload.actor
  }
}

export class SubmissionDeclinedEvent extends EdpBaseEvent<SubmissionDeclinedPayload> {
  constructor(subjectId: string, payload: SubmissionDeclinedPayload) {
    super({
      subjectId,
      eventDomain: 'HRIS_TIME',
      eventType: LeaveRegistryPrivateEventsEnum.SUBMISSION_DECLINED,
      payload,
    })
  }
}
