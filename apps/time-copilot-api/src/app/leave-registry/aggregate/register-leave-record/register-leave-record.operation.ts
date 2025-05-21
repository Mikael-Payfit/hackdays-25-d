import { Actor } from '../../../common/models';
import {
  LeaveRecordCantBeRegisteredError,
  LeaveRecordNotFoundError,
} from '../core/errors';
import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface';
import {
  LeaveRegisteredEvent,
  LeaveRegisteredPayload,
} from './leave-registered.event';

export type RegisterLeaveRecordInput = {
  actor: Actor;
  leaveRecordId: string;
  submissionId: string;
};

export function registerLeaveRecord(
  aggregate: ILeaveRegistryAggregate,
  { actor, leaveRecordId, submissionId }: RegisterLeaveRecordInput
): void {
  const leaveRecord = aggregate.getLeaveRecordByLeaveRecordId(leaveRecordId);
  if (!leaveRecord) {
    throw new LeaveRecordNotFoundError(leaveRecordId);
  }
  if (!leaveRecord.isDraft()) {
    throw new LeaveRecordCantBeRegisteredError(leaveRecordId);
  }

  aggregate.applyBeforePersist([
    new LeaveRegisteredEvent(
      aggregate.getLeaveRegistryId(),
      new LeaveRegisteredPayload({
        leaveRecordId,
        submissionId,
        leaveRegistryId: aggregate.getLeaveRegistryId(),
        leaveRegistryVersion: aggregate.getVersion(),
        actor,
      })
    ),
  ]);
}
