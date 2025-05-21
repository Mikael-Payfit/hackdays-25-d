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
import { IHRISLeavePayload } from './hris-leave-payload'

export type IHRISTimeManagementLeaveCancelledEvent = IEdpEvent<
  IHRISTimeManagementLeaveCancelledPayload,
  PublicEventEnum.LEAVE_CANCELLED
>

export interface IHRISTimeManagementLeaveCancelledPayload
  extends IHRISLeavePayload {
  beginDate: string
  endDate: string
  beginMoment: string
  endMoment: string
}

@EventProducerSchema({
  eventType: PublicEventEnum.LEAVE_CANCELLED,
  subjectType: 'leaveRegistry',
  description: 'Leave cancelled',
  majorVersion: 2,
  schemaName: 'hris-time-management-leave-cancelled',
})
export class HRISTimeManagementLeaveCancelledPayload
  extends EdpBasePayloadEvent
  implements IHRISLeavePayload
{
  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The leave record id' })
  public leaveRecordId: string

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
  @JSONSchema({ description: 'The end date of the leave' })
  public endDate: string

  @IsDefined()
  @IsString()
  @JSONSchema({ description: 'The begin moment of the leave' })
  public beginMoment: string

  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The end moment of the leave' })
  public endMoment: string

  constructor(payload: IHRISTimeManagementLeaveCancelledPayload) {
    super()
    this.leaveRecordId = payload.leaveRecordId
    this.leaveRegistryId = payload.leaveRegistryId
    this.leaveRegistryVersion = payload.leaveRegistryVersion
    this.jlContractId = payload.jlContractId
    this.jlCompanyId = payload.jlCompanyId
    this.country = payload.country
    this.type = payload.type
    this.beginDate = payload.beginDate
    this.endDate = payload.endDate
    this.beginMoment = payload.beginMoment
    this.endMoment = payload.endMoment
  }
}

export class HRISTimeManagementLeaveCancelledEvent extends EdpBaseEvent<HRISTimeManagementLeaveCancelledPayload> {
  constructor(
    subjectId: string,
    payload: HRISTimeManagementLeaveCancelledPayload,
  ) {
    super({
      subjectId,
      subjectType: 'leaveRegistry',
      eventDomain: 'HRIS_TIME',
      eventType: PublicEventEnum.LEAVE_CANCELLED,
      payload,
    })
  }
}
