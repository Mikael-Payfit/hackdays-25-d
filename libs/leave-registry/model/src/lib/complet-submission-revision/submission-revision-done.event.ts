import { Actor } from '@payfit/common-time-model'
import {
  EdpBaseEvent,
  EdpBasePayloadEvent,
  EventProducerSchema,
} from '@payfit/edp-sdk'
import { IsDefined, IsNumber, IsUUID } from 'class-validator'
import { JSONSchema } from 'class-validator-jsonschema'
import { LeaveRegistryPrivateEventsEnum } from '../core/leave-registry-private-events.enum'

export interface ISubmissionRevisionDonePayload {
  submissionId: string
  leaveRegistryId: string
  leaveRegistryVersion: number
  actor: Actor
}

@EventProducerSchema({
  eventType: LeaveRegistryPrivateEventsEnum.SUBMISSION_REVISION_DONE,
  subjectType: 'leaveRegistry',
  description: 'Submission revision done',
  majorVersion: 2,
  schemaName: 'submission-revision-done',
})
export class SubmissionRevisionDonePayload extends EdpBasePayloadEvent {
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
      'The actor who completed the submission revision (id, name & role fields)',
  })
  public actor: Actor

  constructor(payload: ISubmissionRevisionDonePayload) {
    super()
    this.submissionId = payload.submissionId
    this.leaveRegistryId = payload.leaveRegistryId
    this.leaveRegistryVersion = payload.leaveRegistryVersion
    this.actor = payload.actor
  }
}

export class SubmissionRevisionDoneEvent extends EdpBaseEvent<SubmissionRevisionDonePayload> {
  constructor(subjectId: string, payload: SubmissionRevisionDonePayload) {
    super({
      subjectId,
      eventDomain: 'HRIS_TIME',
      eventType: LeaveRegistryPrivateEventsEnum.SUBMISSION_REVISION_DONE,
      payload,
    })
  }
}
