import { CountryCode } from '@payfit/common-time-model'
import {
  EdpBaseEvent,
  EdpBasePayloadEvent,
  EventProducerSchema,
  IEdpEvent,
} from '@payfit/edp-sdk'
import { IsDefined, IsNumber, IsString, IsUUID } from 'class-validator'
import { JSONSchema } from 'class-validator-jsonschema'
import { PublicEventEnum } from './event-enum'

export type ILegacyLeaveUpdatedEvent = IEdpEvent<
  ILegacyLeaveUpdatedPayload,
  PublicEventEnum.LEGACY_LEAVE_UPDATED
>

export interface ILegacyLeaveUpdatedPayload {
  jlHashtableRowId: string
  leaveRegistryId: string
  leaveRegistryVersion: number
  jlContractId: string
  jlCompanyId: string
  country: CountryCode
  type: string
  newBeginDate: string
  newBeginMoment: string
  newEndDate: string
  newEndMoment: string
  oldBeginDate: string
  oldBeginMoment: string
  oldEndDate: string
  oldEndMoment: string
}

@EventProducerSchema({
  eventType: PublicEventEnum.LEGACY_LEAVE_UPDATED,
  subjectType: 'leaveRegistry',
  description: 'Legacy Leave updated',
  majorVersion: 1,
  schemaName: 'hris-time-management-legacy-leave-updated',
})
export class LegacyLeaveUpdatedPayload
  extends EdpBasePayloadEvent
  implements ILegacyLeaveUpdatedPayload
{
  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The hashtable row id' })
  public jlHashtableRowId: string

  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The leave registry id' })
  public leaveRegistryId: string

  @IsNumber()
  @IsDefined()
  @JSONSchema({ description: 'The leave registry version' })
  public leaveRegistryVersion: number

  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The JL contract id' })
  public jlContractId: string

  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The JL company id' })
  public jlCompanyId: string

  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The country code' })
  public country: CountryCode

  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The leave type' })
  public type: string

  @IsDefined()
  @IsString()
  @JSONSchema({ description: 'The begin date of the leave' })
  public newBeginDate: string

  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The begin moment of the leave' })
  public newBeginMoment: string

  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The end date of the leave' })
  public newEndDate: string

  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The end moment of the leave' })
  public newEndMoment: string

  @IsDefined()
  @IsString()
  @JSONSchema({ description: 'The old begin date of the leave' })
  public oldBeginDate: string

  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The old begin moment of the leave' })
  public oldBeginMoment: string

  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The old end date of the leave' })
  public oldEndDate: string

  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The old end moment of the leave' })
  public oldEndMoment: string

  constructor(payload: ILegacyLeaveUpdatedPayload) {
    super()
    this.jlHashtableRowId = payload.jlHashtableRowId
    this.leaveRegistryId = payload.leaveRegistryId
    this.leaveRegistryVersion = payload.leaveRegistryVersion
    this.jlContractId = payload.jlContractId
    this.jlCompanyId = payload.jlCompanyId
    this.country = payload.country
    this.type = payload.type
    this.newBeginDate = payload.newBeginDate
    this.newBeginMoment = payload.newBeginMoment
    this.newEndDate = payload.newEndDate
    this.newEndMoment = payload.newEndMoment
    this.oldBeginDate = payload.oldBeginDate
    this.oldBeginMoment = payload.oldBeginMoment
    this.oldEndDate = payload.oldEndDate
    this.oldEndMoment = payload.oldEndMoment
  }
}

export class LegacyLeaveUpdatedEvent extends EdpBaseEvent<LegacyLeaveUpdatedPayload> {
  constructor(subjectId: string, payload: LegacyLeaveUpdatedPayload) {
    super({
      subjectId,
      subjectType: 'leaveRegistry',
      eventDomain: 'HRIS_TIME',
      eventType: PublicEventEnum.LEGACY_LEAVE_UPDATED,
      payload,
    })
  }
}
