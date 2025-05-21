import { BusinessError } from '../../../../common/errors';

export class LeaveRecordCantBeRegisteredError extends BusinessError {
  constructor(leaveRecordId: string) {
    super(
      `LeaveRecord ${leaveRecordId} can't be registered, it's not in a draft status`
    );
  }
}
