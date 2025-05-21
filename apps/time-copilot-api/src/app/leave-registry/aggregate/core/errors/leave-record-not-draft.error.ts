import { BusinessError } from '../../../../common/errors';

export class LeaveRecordNotDraftError extends BusinessError {
  constructor(leaveRecordId: string) {
    super(
      `LeaveRecord ${leaveRecordId} is not dragt. It is not possible to discard it.`
    );
  }
}
