import { BusinessError } from '@payfit/common-time-model'

export class LeaveRegistryNotFoundError extends BusinessError {
  constructor(leaveRegistryId: string) {
    super(`No LeaveRegistry found for leaveRegistryId ${leaveRegistryId}`)
  }
}
