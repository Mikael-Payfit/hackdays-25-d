import { BusinessError } from '../../../../common/errors';

export class LeaveRegistryNotFoundError extends BusinessError {
  constructor(leaveRegistryId: string) {
    super(`No LeaveRegistry found for leaveRegistryId ${leaveRegistryId}`);
  }
}
