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

export type ILegacyLeaveRegisteredEvent = IEdpEvent<
  ILegacyLeaveRegisteredPayload,
  PublicEventEnum.LEGACY_LEAVE_REGISTERED
>

export interface ILegacyLeaveRegisteredPayload {
  jlHashtableRowId: string
  leaveRegistryId: string
  leaveRegistryVersion: number
  jlContractId: string
  jlCompanyId: string
  country: CountryCode
  type: string
  beginDate: string
  beginMoment: string
  endDate: string
  endMoment: string
}

@EventProducerSchema({
  eventType: PublicEventEnum.LEGACY_LEAVE_REGISTERED,
  subjectType: 'leaveRegistry',
  description: 'Legacy Leave registered',
  majorVersion: 1,
  schemaName: 'hris-time-management-legacy-leave-registered',
})
export class LegacyLeaveRegisteredPayload
  extends EdpBasePayloadEvent
  implements ILegacyLeaveRegisteredPayload
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
  public beginDate: string

  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The begin moment of the leave' })
  public beginMoment: string

  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The end date of the leave' })
  public endDate: string

  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The end moment of the leave' })
  public endMoment: string

  constructor(payload: ILegacyLeaveRegisteredPayload) {
    super()
    this.jlHashtableRowId = payload.jlHashtableRowId
    this.leaveRegistryId = payload.leaveRegistryId
    this.leaveRegistryVersion = payload.leaveRegistryVersion
    this.jlContractId = payload.jlContractId
    this.jlCompanyId = payload.jlCompanyId
    this.country = payload.country
    this.type = payload.type
    this.beginDate = payload.beginDate
    this.beginMoment = payload.beginMoment
    this.endDate = payload.endDate
    this.endMoment = payload.endMoment
  }
}

export class LegacyLeaveRegisteredEvent extends EdpBaseEvent<LegacyLeaveRegisteredPayload> {
  constructor(subjectId: string, payload: LegacyLeaveRegisteredPayload) {
    super({
      subjectId,
      subjectType: 'leaveRegistry',
      eventDomain: 'HRIS_TIME',
      eventType: PublicEventEnum.LEGACY_LEAVE_REGISTERED,
      payload,
    })
  }
}
