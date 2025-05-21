import { BusinessError } from '../../../../common/errors';

export class LeaveRecordNotOngoingError extends BusinessError {
  constructor(leaveRecordId: string) {
    super(
      `LeaveRecord ${leaveRecordId} is not ongoing. It is not possible to cancel it.`
    );
  }
}
