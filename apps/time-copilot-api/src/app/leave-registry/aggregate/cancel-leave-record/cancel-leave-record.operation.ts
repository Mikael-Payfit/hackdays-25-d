import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface';

import {
  LeaveRecordNotFoundError,
  LeaveRecordNotOngoingError,
} from '../core/errors';
import { LeaveRecord } from '../core/value-objects';
import {
  LeaveCancelledEvent,
  LeaveCancelledPayload,
} from './leave-cancelled.event';
import { Actor } from '../../../common/models';

export type CancelLeaveRecordInput = {
  actor: Actor;
  leaveRecordId: string;
  submissionId: string;
};

export function cancelLeaveRecord(
  aggregate: ILeaveRegistryAggregate,
  { actor, leaveRecordId, submissionId }: CancelLeaveRecordInput
) {
  const leaveRecord: LeaveRecord | undefined =
    aggregate.getLeaveRecordByLeaveRecordId(leaveRecordId);
  if (!leaveRecord) {
    throw new LeaveRecordNotFoundError(leaveRecordId);
  }

  if (!leaveRecord.isOngoing()) {
    throw new LeaveRecordNotOngoingError(leaveRecordId);
  }

  aggregate.applyBeforePersist([
    new LeaveCancelledEvent(
      aggregate.getLeaveRegistryId(),
      new LeaveCancelledPayload({
        leaveRecordId,
        submissionId,
        leaveRegistryId: aggregate.getLeaveRegistryId(),
        leaveRegistryVersion: aggregate.getVersion(),
        actor,
      })
    ),
  ]);
}
