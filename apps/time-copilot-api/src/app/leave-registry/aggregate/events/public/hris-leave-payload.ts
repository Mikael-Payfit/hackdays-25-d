import { CountryCode } from '../../../../common/models';

export interface IHRISLeavePayload {
  leaveRecordId: string;
  leaveRegistryId: string;
  leaveRegistryVersion: number;
  jlContractId: string;
  jlCompanyId: string;
  country: CountryCode;
  type: string;
}
