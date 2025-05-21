import { CountryCode } from '@payfit/common-time-model'

export interface IHRISLeavePayload {
  leaveRecordId: string
  leaveRegistryId: string
  leaveRegistryVersion: number
  jlContractId: string
  jlCompanyId: string
  country: CountryCode
  type: string
}
