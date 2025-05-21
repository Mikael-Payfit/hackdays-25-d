import { BusinessError } from '../../../../common/errors';

export class NoOpenSubmissionForLeaveRecordFoundError extends BusinessError {
  constructor(leaveRecordId: string) {
    super(`No open submission found for leaveRecordId ${leaveRecordId}`);
  }
}
