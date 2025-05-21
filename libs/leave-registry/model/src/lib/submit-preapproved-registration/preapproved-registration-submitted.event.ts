import { Actor } from '@payfit/common-time-model'
import {
  EdpBaseEvent,
  EdpBasePayloadEvent,
  EventProducerSchema,
} from '@payfit/edp-sdk'
import { IsDefined, IsNumber, IsUUID } from 'class-validator'
import { JSONSchema } from 'class-validator-jsonschema'
import { LeaveRegistryPrivateEventsEnum } from '../core/leave-registry-private-events.enum'

export interface IPreapprovedRegistrationSubmittedPayload {
  submissionId: string
  leaveRegistryId: string
  leaveRegistryVersion: number
  actor: Actor
}

@EventProducerSchema({
  eventType: LeaveRegistryPrivateEventsEnum.REGISTRATION_PREAPPROVED,
  subjectType: 'leaveRegistry',
  description: 'Registration Preapproved',
  majorVersion: 1,
  schemaName: 'registration-preapproved',
})
export class PreapprovedRegistrationSubmittedPayload extends EdpBasePayloadEvent {
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
      'The actor who registered the preapproved submission (id, name & role fields)',
  })
  public actor: Actor

  constructor(payload: IPreapprovedRegistrationSubmittedPayload) {
    super()
    this.submissionId = payload.submissionId
    this.leaveRegistryId = payload.leaveRegistryId
    this.leaveRegistryVersion = payload.leaveRegistryVersion
    this.actor = payload.actor
  }
}

export class PreapprovedRegistrationSubmittedEvent extends EdpBaseEvent<PreapprovedRegistrationSubmittedPayload> {
  constructor(
    subjectId: string,
    payload: PreapprovedRegistrationSubmittedPayload,
  ) {
    super({
      subjectId,
      eventDomain: 'HRIS_TIME',
      eventType: LeaveRegistryPrivateEventsEnum.REGISTRATION_PREAPPROVED,
      payload,
    })
  }
}
