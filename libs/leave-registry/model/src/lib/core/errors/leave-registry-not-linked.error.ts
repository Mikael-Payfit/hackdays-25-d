import { BusinessError } from '@payfit/common-time-model'

export class LeaveRegistryNotLinkedError extends BusinessError {
  constructor(leaveRegistryId: string) {
    super(`LeaveRegistry not linked ${leaveRegistryId}`)
  }
}
