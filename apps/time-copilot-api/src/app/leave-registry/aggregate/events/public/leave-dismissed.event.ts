import {
  EdpBaseEvent,
  EdpBasePayloadEvent,
  EventProducerSchema,
  IEdpEvent,
} from '@payfit/edp-sdk';
import { IsDefined, IsNumber, IsString, IsUUID } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { CountryCode } from '../../../../common/models';
import { PublicEventEnum } from './event-enum';
import { IHRISLeavePayload } from './hris-leave-payload';

export type IHRISTimeManagementLeaveDismissedEvent = IEdpEvent<
  IHRISTimeManagementLeaveDismissedPayload,
  PublicEventEnum.LEAVE_DISMISSED
>;

export type IHRISTimeManagementLeaveDismissedPayload = IHRISLeavePayload;

@EventProducerSchema({
  eventType: PublicEventEnum.LEAVE_DISMISSED,
  subjectType: 'leaveRegistry',
  description: 'Leave dismissed',
  majorVersion: 7,
  schemaName: 'hris-time-management-leave-dismissed',
})
export class HRISTimeManagementLeaveDismissedPayload
  extends EdpBasePayloadEvent
  implements IHRISLeavePayload
{
  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The leave record id' })
  public leaveRecordId: string;

  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The leave registry id' })
  public leaveRegistryId: string;

  @IsNumber()
  @IsDefined()
  @JSONSchema({ description: 'The leave registry version' })
  public leaveRegistryVersion: number;

  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The JL contract id' })
  public jlContractId: string;

  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The JL company id' })
  public jlCompanyId: string;

  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The country code' })
  public country: CountryCode;

  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The leave type' })
  public type: string;

  constructor(payload: IHRISTimeManagementLeaveDismissedPayload) {
    super();
    this.leaveRecordId = payload.leaveRecordId;
    this.leaveRegistryId = payload.leaveRegistryId;
    this.leaveRegistryVersion = payload.leaveRegistryVersion;
    this.jlContractId = payload.jlContractId;
    this.jlCompanyId = payload.jlCompanyId;
    this.country = payload.country;
    this.type = payload.type;
  }
}

export class HRISTimeManagementLeaveDismissedEvent extends EdpBaseEvent<HRISTimeManagementLeaveDismissedPayload> {
  constructor(
    subjectId: string,
    payload: HRISTimeManagementLeaveDismissedPayload
  ) {
    super({
      subjectId,
      subjectType: 'leaveRegistry',
      eventDomain: 'HRIS_TIME',
      eventType: PublicEventEnum.LEAVE_DISMISSED,
      payload,
    });
  }
}
