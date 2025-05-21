import { BusinessError } from '@payfit/common-time-model'

export class LeaveRecordCantBeRegisteredError extends BusinessError {
  constructor(leaveRecordId: string) {
    super(
      `LeaveRecord ${leaveRecordId} can't be registered, it's not in a draft status`,
    )
  }
}
