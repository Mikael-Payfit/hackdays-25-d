import { BusinessError } from '@payfit/common-time-model'

export class LeaveRecordNotDraftError extends BusinessError {
  constructor(leaveRecordId: string) {
    super(
      `LeaveRecord ${leaveRecordId} is not dragt. It is not possible to discard it.`,
    )
  }
}
