import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface';

import { Actor, RolledbackValue } from '../../../common/models';
import { LeaveRecordNotFoundError } from '../core/errors';
import {
  LeavePeriodHelper,
  LeaveRecord,
  LeaveStatusHelper,
  LeaveTypeHelper,
} from '../core/value-objects';
import {
  LeaveRolledbackEvent,
  LeaveRolledbackPayload,
} from './leave-rolledback.event';

export type RollbackLeaveRecordInput = {
  actor: Actor;
  previousLeaveRecord: LeaveRecord;
};

export type RollbackLeaveRecordOutput = {
  rolledbackValues: RolledbackValue[];
};

export function rollbackLeaveRecord(
  aggregate: ILeaveRegistryAggregate,
  { actor, previousLeaveRecord }: RollbackLeaveRecordInput
): RollbackLeaveRecordOutput {
  const actualLeaveRecord = aggregate.getLeaveRecordByLeaveRecordId(
    previousLeaveRecord.id
  );

  if (!actualLeaveRecord) {
    throw new LeaveRecordNotFoundError(previousLeaveRecord.id);
  }

  const rolledbackValues: RolledbackValue[] = [];
  if (
    !LeaveTypeHelper.isEquals(
      previousLeaveRecord.leaveType,
      actualLeaveRecord.leaveType
    )
  ) {
    rolledbackValues.push({
      key: 'leaveType',
      droppedValue: actualLeaveRecord.leaveType,
      restoredValue: previousLeaveRecord.leaveType,
    });
  }

  if (
    !LeavePeriodHelper.isEquals(
      previousLeaveRecord.leavePeriod,
      actualLeaveRecord.leavePeriod
    )
  ) {
    rolledbackValues.push({
      key: 'leavePeriod',
      droppedValue: actualLeaveRecord.leavePeriod,
      restoredValue: previousLeaveRecord.leavePeriod,
    });
  }

  if (
    !LeaveStatusHelper.isEquals(
      previousLeaveRecord.leaveStatus,
      actualLeaveRecord.leaveStatus
    )
  ) {
    rolledbackValues.push({
      key: 'leaveStatus',
      droppedValue: actualLeaveRecord.leaveStatus,
      restoredValue: previousLeaveRecord.leaveStatus,
    });
  }

  if (rolledbackValues.length > 0) {
    aggregate.applyBeforePersist([
      new LeaveRolledbackEvent(
        aggregate.getLeaveRegistryId(),
        new LeaveRolledbackPayload({
          leaveRecordId: previousLeaveRecord.id,
          leaveRegistryId: aggregate.getLeaveRegistryId(),
          leaveRegistryVersion: aggregate.getVersion(),
          rolledbackValues,
          actor,
        })
      ),
    ]);
  }

  return {
    rolledbackValues,
  };
}
