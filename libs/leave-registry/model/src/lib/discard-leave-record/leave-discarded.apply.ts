import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface'
import { LeaveStatusHelper } from '../core/value-objects'
import { LeaveDiscardedEvent } from './leave-discarded.event'

export function applyLeaveDiscarded(
  aggregate: ILeaveRegistryAggregate,
  event: LeaveDiscardedEvent,
) {
  const leaveRecord = aggregate.getLeaveRecordByLeaveRecordId(
    event.payload.leaveRecordId,
  )
  if (leaveRecord) {
    leaveRecord.leaveStatus = LeaveStatusHelper.getDiscarded()

    // Submission
    const submission = aggregate.getSubmission(event.payload.submissionId)
    if (submission) {
      submission.addLeaveRecord(leaveRecord)
    }
  }
}
