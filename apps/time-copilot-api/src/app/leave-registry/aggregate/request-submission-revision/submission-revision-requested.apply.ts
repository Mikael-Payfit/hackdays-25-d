import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface'
import { SubmissionRevisionRequestedEvent } from './submission-revision-requested.event'

export function applySubmissionRevisionRequested(
  aggregate: ILeaveRegistryAggregate,
  event: SubmissionRevisionRequestedEvent,
) {
  const submission = aggregate.getSubmission(event.payload.submissionId)
  if (submission) {
    submission.addRevisionRequestedStep(event.payload.actor)
  }
}
