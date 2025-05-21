import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface'
import { SubmissionApprovedEvent } from './submission-approved.event'

export function applySubmissionApproved(
  aggregate: ILeaveRegistryAggregate,
  event: SubmissionApprovedEvent,
) {
  const submission = aggregate.getSubmission(event.payload.submissionId)
  if (submission) {
    submission.addApprovalStep(
      event.payload.actor,
      'Has been manually approved',
    )
    submission.addCompletionStep(
      event.payload.actor,
      'Has been manually approved',
    )
  }
}
