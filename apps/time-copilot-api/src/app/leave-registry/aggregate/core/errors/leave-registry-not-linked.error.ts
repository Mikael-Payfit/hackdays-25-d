import { BusinessError } from '../../../../common/errors';

export class LeaveRegistryNotLinkedError extends BusinessError {
  constructor(leaveRegistryId: string) {
    super(`LeaveRegistry not linked ${leaveRegistryId}`);
  }
}
