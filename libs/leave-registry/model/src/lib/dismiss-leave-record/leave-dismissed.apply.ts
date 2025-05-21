import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface'
import { LeaveStatusHelper } from '../core/value-objects'
import { LeaveDismissedEvent } from './leave-dismissed.event'

export function applyLeaveDismissed(
  aggregate: ILeaveRegistryAggregate,
  event: LeaveDismissedEvent,
): void {
  const leaveRecord = aggregate.getLeaveRecordByLeaveRecordId(
    event.payload.leaveRecordId,
  )
  if (leaveRecord) {
    leaveRecord.leaveStatus = LeaveStatusHelper.getDismissed()
  }
}
