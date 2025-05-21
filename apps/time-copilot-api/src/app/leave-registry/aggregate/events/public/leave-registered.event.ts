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

export type IHRISTimeManagementLeaveRegisteredEvent = IEdpEvent<
  IHRISTimeManagementLeaveRegisteredPayload,
  PublicEventEnum.LEAVE_REGISTERED
>;

export interface IHRISTimeManagementLeaveRegisteredPayload
  extends IHRISLeavePayload {
  beginDate: string;
  beginMoment: string;
  endDate: string;
  endMoment: string;
}

@EventProducerSchema({
  eventType: PublicEventEnum.LEAVE_REGISTERED,
  subjectType: 'leaveRegistry',
  description: 'Leave registered',
  majorVersion: 7,
  schemaName: 'hris-time-management-leave-registered',
})
export class HRISTimeManagementLeaveRegisteredPayload
  extends EdpBasePayloadEvent
  implements IHRISTimeManagementLeaveRegisteredPayload
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

  @IsDefined()
  @IsString()
  @JSONSchema({ description: 'The begin date of the leave' })
  public beginDate: string;

  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The begin moment of the leave' })
  public beginMoment: string;

  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The end date of the leave' })
  public endDate: string;

  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The end moment of the leave' })
  public endMoment: string;

  constructor(payload: IHRISTimeManagementLeaveRegisteredPayload) {
    super();
    this.leaveRecordId = payload.leaveRecordId;
    this.leaveRegistryId = payload.leaveRegistryId;
    this.leaveRegistryVersion = payload.leaveRegistryVersion;
    this.jlContractId = payload.jlContractId;
    this.jlCompanyId = payload.jlCompanyId;
    this.country = payload.country;
    this.type = payload.type;
    this.beginDate = payload.beginDate;
    this.beginMoment = payload.beginMoment;
    this.endDate = payload.endDate;
    this.endMoment = payload.endMoment;
  }
}

export class HRISTimeManagementLeaveRegisteredEvent extends EdpBaseEvent<HRISTimeManagementLeaveRegisteredPayload> {
  constructor(
    subjectId: string,
    payload: HRISTimeManagementLeaveRegisteredPayload
  ) {
    super({
      subjectId,
      subjectType: 'leaveRegistry',
      eventDomain: 'HRIS_TIME',
      eventType: PublicEventEnum.LEAVE_REGISTERED,
      payload,
    });
  }
}
