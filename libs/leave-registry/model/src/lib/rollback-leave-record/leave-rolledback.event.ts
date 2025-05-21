import {
  IsArray,
  IsDefined,
  IsNumber,
  IsUUID,
  ValidateNested,
} from 'class-validator'
import { JSONSchema } from 'class-validator-jsonschema'

import {
  EdpBaseEvent,
  EdpBasePayloadEvent,
  EdpSchemaChildType,
  EventProducerSchema,
} from '@payfit/edp-sdk'

import {
  Actor,
  RolledbackValue,
  RolledbackValueDefinition,
} from '@payfit/common-time-model'
import { LeaveRegistryPrivateEventsEnum } from '../core/leave-registry-private-events.enum'

export interface ILeaveRolledbackPayload {
  leaveRecordId: string
  leaveRegistryId: string
  leaveRegistryVersion: number
  rolledbackValues: RolledbackValue[]
  actor: Actor
}

@EventProducerSchema({
  eventType: LeaveRegistryPrivateEventsEnum.LEAVE_ROLLEDBACK,
  subjectType: 'leaveRegistry',
  description: 'Leave rolledback',
  majorVersion: 3,
  schemaName: 'leave-rolledback',
})
export class LeaveRolledbackPayload extends EdpBasePayloadEvent {
  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The leave record id' })
  public leaveRecordId: string

  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The leaveRegistry id' })
  public leaveRegistryId: string

  @IsNumber()
  @IsDefined()
  @JSONSchema({ description: 'The leave registry version' })
  public leaveRegistryVersion: number

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @EdpSchemaChildType(RolledbackValueDefinition)
  @JSONSchema({ description: 'The rolledback values' })
  public rolledbackValues: RolledbackValueDefinition[]

  @IsDefined()
  @JSONSchema({
    description: 'The actor who rollbacked the update-leave',
  })
  public actor: Actor

  constructor(payload: ILeaveRolledbackPayload) {
    super()
    this.leaveRecordId = payload.leaveRecordId
    this.leaveRegistryId = payload.leaveRegistryId
    this.leaveRegistryVersion = payload.leaveRegistryVersion
    this.rolledbackValues = payload.rolledbackValues.map(
      (rolledbackValue) => new RolledbackValueDefinition(rolledbackValue),
    )
    this.actor = payload.actor
  }
}

export class LeaveRolledbackEvent extends EdpBaseEvent<LeaveRolledbackPayload> {
  constructor(subjectId: string, payload: LeaveRolledbackPayload) {
    super({
      subjectId,
      eventDomain: 'HRIS_TIME',
      eventType: LeaveRegistryPrivateEventsEnum.LEAVE_ROLLEDBACK,
      payload,
    })
  }
}
