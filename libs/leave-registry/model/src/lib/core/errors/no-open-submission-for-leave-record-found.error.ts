import { BusinessError } from '@payfit/common-time-model'

export class NoOpenSubmissionForLeaveRecordFoundError extends BusinessError {
  constructor(leaveRecordId: string) {
    super(`No open submission found for leaveRecordId ${leaveRecordId}`)
  }
}
