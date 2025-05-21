import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface'
import { SubmissionDiscardedEvent } from './submission-discarded.event'

export function applySubmissionDiscarded(
  aggregate: ILeaveRegistryAggregate,
  event: SubmissionDiscardedEvent,
): void {
  const submission = aggregate.getSubmission(event.payload.submissionId)

  if (submission) {
    submission.addDiscardStep(
      event.payload.actor,
      'Has been manually discarded',
    )
    submission.addCompletionStep(
      event.payload.actor,
      'Has been manually discarded',
    )
  }
}
