import { Actor, ISOFormatDate, MomentOfDay } from '@payfit/common-time-model'
import {
  EdpBaseEvent,
  EdpBasePayloadEvent,
  EventProducerSchema,
} from '@payfit/edp-sdk'
import { IsDefined, IsNumber, IsString, IsUUID } from 'class-validator'
import { JSONSchema } from 'class-validator-jsonschema'
import { LeaveRegistryPrivateEventsEnum } from '../core/leave-registry-private-events.enum'

export interface ILeaveRequestedPayload {
  leaveRecordId: string
  submissionId: string
  leaveRegistryId: string
  leaveRegistryVersion: number
  actor: Actor
  type: string
  country: string
  beginDate: ISOFormatDate
  beginMoment: MomentOfDay
  endDate: ISOFormatDate
  endMoment: MomentOfDay
}

@EventProducerSchema({
  eventType: LeaveRegistryPrivateEventsEnum.LEAVE_REQUESTED,
  subjectType: 'leaveRegistry',
  description: 'Leave requested',
  majorVersion: 2,
  schemaName: 'leave-requested',
})
export class LeaveRequestedPayload extends EdpBasePayloadEvent {
  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The leave record id' })
  public leaveRecordId: string

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
    description: 'The actor who requested the leave (id, name & role fields)',
  })
  public actor: Actor

  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The type of leave' })
  public type: string

  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The country code' })
  public country: string

  @IsDefined()
  @JSONSchema({ description: 'The begin date of the leave' })
  public beginDate: ISOFormatDate

  @IsDefined()
  @JSONSchema({ description: 'The begin moment of the leave' })
  public beginMoment: MomentOfDay

  @IsDefined()
  @JSONSchema({ description: 'The end date of the leave' })
  public endDate: ISOFormatDate

  @IsDefined()
  @JSONSchema({ description: 'The end moment of the leave' })
  public endMoment: MomentOfDay

  constructor(payload: ILeaveRequestedPayload) {
    super()
    this.leaveRecordId = payload.leaveRecordId
    this.submissionId = payload.submissionId
    this.leaveRegistryId = payload.leaveRegistryId
    this.leaveRegistryVersion = payload.leaveRegistryVersion
    this.actor = payload.actor
    this.type = payload.type
    this.country = payload.country
    this.beginDate = payload.beginDate
    this.beginMoment = payload.beginMoment
    this.endDate = payload.endDate
    this.endMoment = payload.endMoment
  }
}

export class LeaveRequestedEvent extends EdpBaseEvent<LeaveRequestedPayload> {
  constructor(subjectId: string, payload: LeaveRequestedPayload) {
    super({
      subjectId,
      eventDomain: 'HRIS_TIME',
      eventType: LeaveRegistryPrivateEventsEnum.LEAVE_REQUESTED,
      payload,
    })
  }
}
