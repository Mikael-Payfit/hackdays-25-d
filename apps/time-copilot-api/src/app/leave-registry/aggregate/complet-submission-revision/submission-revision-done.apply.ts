import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface'
import { SubmissionRevisionDoneEvent } from './submission-revision-done.event'

export function applySubmissionRevisionDone(
  aggregate: ILeaveRegistryAggregate,
  event: SubmissionRevisionDoneEvent,
): void {
  const submission = aggregate.getSubmission(event.payload.submissionId)

  if (submission) {
    submission.addRevisionDoneStep(
      event.payload.actor,
      'Has been manually approved',
    )
  }
}
