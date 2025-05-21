import {
  IsArray,
  IsDefined,
  IsNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator'
import { JSONSchema } from 'class-validator-jsonschema'

import {
  CountryCode,
  RolledbackValue,
  RolledbackValueDefinition,
} from '@payfit/common-time-model'
import {
  EdpBaseEvent,
  EdpBasePayloadEvent,
  EdpSchemaChildType,
  EventProducerSchema,
  IEdpEvent,
} from '@payfit/edp-sdk'

import { PublicEventEnum } from './event-enum'
import { IHRISLeavePayload } from './hris-leave-payload'
export type IHRISTimeManagementLeaveRolledbackEvent = IEdpEvent<
  IHRISTimeManagementLeaveRolledbackPayload,
  PublicEventEnum.LEAVE_ROLLEDBACK
>

export interface IHRISTimeManagementLeaveRolledbackPayload
  extends IHRISLeavePayload {
  rolledbackValues: RolledbackValue[]
}

@EventProducerSchema({
  eventType: PublicEventEnum.LEAVE_ROLLEDBACK,
  subjectType: 'leaveRegistry',
  description: 'Leave period updated',
  majorVersion: 5,
  schemaName: 'hris-time-management-leave-record-rolledback',
})
export class HRISTimeManagementLeaveRolledbackPayload
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

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @EdpSchemaChildType(RolledbackValueDefinition)
  @JSONSchema({ description: 'The rolledback values' })
  public rolledbackValues: RolledbackValueDefinition[]

  constructor(payload: IHRISTimeManagementLeaveRolledbackPayload) {
    super()
    this.leaveRecordId = payload.leaveRecordId
    this.leaveRegistryId = payload.leaveRegistryId
    this.leaveRegistryVersion = payload.leaveRegistryVersion
    this.jlContractId = payload.jlContractId
    this.jlCompanyId = payload.jlCompanyId
    this.country = payload.country
    this.type = payload.type
    this.rolledbackValues = payload.rolledbackValues.map(
      (rolledbackValue) => new RolledbackValueDefinition(rolledbackValue),
    )
  }
}

export class HRISTimeManagementLeaveRolledbackEvent extends EdpBaseEvent<HRISTimeManagementLeaveRolledbackPayload> {
  constructor(
    subjectId: string,
    payload: HRISTimeManagementLeaveRolledbackPayload,
  ) {
    super({
      subjectId,
      subjectType: 'leaveRegistry',
      eventDomain: 'HRIS_TIME',
      eventType: PublicEventEnum.LEAVE_ROLLEDBACK,
      payload,
    })
  }
}
