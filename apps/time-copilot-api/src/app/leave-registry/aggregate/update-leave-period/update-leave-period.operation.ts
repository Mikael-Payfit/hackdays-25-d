import { Actor } from '../../../common/models';
import {
  InvalidLeavePeriodError,
  InvalidLeavePeriodUpdateError,
  LeaveRecordNotFoundError,
  OverlappingLeaveError,
} from '../core/errors';
import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface';
import {
  LeavePeriod,
  LeavePeriodHelper,
} from '../core/value-objects/leave-period';
import {
  LeavePeriodUpdatedEvent,
  LeavePeriodUpdatedPayload,
} from './leave-period-updated.event';

export type UpdateLeavePeriodInput = {
  actor: Actor;
  leaveRecordId: string;
  newLeavePeriod: LeavePeriod;
  submissionId: string;
};

export function updateLeavePeriod(
  aggregate: ILeaveRegistryAggregate,
  { actor, leaveRecordId, newLeavePeriod, submissionId }: UpdateLeavePeriodInput
): void {
  const leavePeriodValid = LeavePeriodHelper.isValid(newLeavePeriod);
  if (!leavePeriodValid) {
    throw new InvalidLeavePeriodError(
      LeavePeriodHelper.getInvalidationErrors(newLeavePeriod)
    );
  }

  const actualLeaveRecord =
    aggregate.getLeaveRecordByLeaveRecordId(leaveRecordId);

  // check if the leave record exists
  if (!actualLeaveRecord) {
    throw new LeaveRecordNotFoundError(leaveRecordId);
  }

  if (
    aggregate.hasRegisteredOverlappingLeaveRecords({
      leavePeriod: newLeavePeriod,
      excludeLeaveRecordId: leaveRecordId,
    })
  ) {
    throw new OverlappingLeaveError();
  }

  if (
    LeavePeriodHelper.isEquals(actualLeaveRecord.leavePeriod, newLeavePeriod)
  ) {
    throw new InvalidLeavePeriodUpdateError([
      'New leave period should be different than the original',
    ]);
  }

  aggregate.applyBeforePersist([
    new LeavePeriodUpdatedEvent(
      aggregate.getLeaveRegistryId(),
      new LeavePeriodUpdatedPayload({
        leaveRecordId,
        actor,
        leaveRegistryId: aggregate.getLeaveRegistryId(),
        leaveRegistryVersion: aggregate.getVersion(),
        submissionId,
        newBeginDate: newLeavePeriod.begin.date,
        newBeginMoment: newLeavePeriod.begin.moment,
        newEndDate: newLeavePeriod.end.date,
        newEndMoment: newLeavePeriod.end.moment,
      })
    ),
  ]);
}
