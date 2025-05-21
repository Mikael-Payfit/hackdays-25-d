import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface'
import { LeaveStatusHelper } from '../core/value-objects'
import { LeaveCancelledEvent } from './leave-cancelled.event'

export function applyLeaveCancelled(
  aggregate: ILeaveRegistryAggregate,
  event: LeaveCancelledEvent,
) {
  const leaveRecord = aggregate.getLeaveRecordByLeaveRecordId(
    event.payload.leaveRecordId,
  )
  if (leaveRecord) {
    leaveRecord.leaveStatus = LeaveStatusHelper.getCancelled()

    // Submission
    const submission = aggregate.getSubmission(event.payload.submissionId)
    if (submission) {
      submission.addLeaveRecord(leaveRecord)
    }
  }
}
