import { BusinessError } from '@payfit/common-time-model'

export class LeaveRecordNotFoundError extends BusinessError {
  constructor(leaveRecordId: string, suffix?: string) {
    if (suffix) {
      super(`No LeaveRecord found for leaveRecordId ${leaveRecordId} ${suffix}`)
    } else {
      super(`No LeaveRecord found for leaveRecordId ${leaveRecordId}`)
    }
  }
}
