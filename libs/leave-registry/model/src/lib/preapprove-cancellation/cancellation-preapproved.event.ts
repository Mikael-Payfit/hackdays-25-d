import { IsDefined, IsNumber, IsUUID } from 'class-validator'
import { JSONSchema } from 'class-validator-jsonschema'

import {
  EdpBaseEvent,
  EdpBasePayloadEvent,
  EventProducerSchema,
} from '@payfit/edp-sdk'

import { Actor } from '@payfit/common-time-model'
import { LeaveRegistryPrivateEventsEnum } from '../core/leave-registry-private-events.enum'

export interface ICancellationPreapprovedPayload {
  submissionId: string
  leaveRegistryId: string
  leaveRegistryVersion: number
  actor: Actor
}

@EventProducerSchema({
  eventType: LeaveRegistryPrivateEventsEnum.CANCELLATION_PREAPPROVED,
  subjectType: 'leaveRegistry',
  description: 'Cancellation Preapproved',
  majorVersion: 1,
  schemaName: 'cancellation-preapproved',
})
export class CancellationPreapprovedPayload extends EdpBasePayloadEvent {
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
      'The actor who registered the preapproved cancellation submission (id, name & role fields)',
  })
  public actor: Actor

  constructor(payload: ICancellationPreapprovedPayload) {
    super()
    this.submissionId = payload.submissionId
    this.leaveRegistryId = payload.leaveRegistryId
    this.leaveRegistryVersion = payload.leaveRegistryVersion
    this.actor = payload.actor
  }
}

export class CancellationPreapprovedEvent extends EdpBaseEvent<CancellationPreapprovedPayload> {
  constructor(subjectId: string, payload: CancellationPreapprovedPayload) {
    super({
      subjectId,
      eventDomain: 'HRIS_TIME',
      eventType: LeaveRegistryPrivateEventsEnum.CANCELLATION_PREAPPROVED,
      payload,
    })
  }
}
