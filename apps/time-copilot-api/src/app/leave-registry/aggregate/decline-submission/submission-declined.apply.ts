import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface'
import { SubmissionDeclinedEvent } from './submission-declined.event'

export function applySubmissionDeclined(
  aggregate: ILeaveRegistryAggregate,
  event: SubmissionDeclinedEvent,
) {
  const submission = aggregate.getSubmission(event.payload.submissionId)

  if (submission) {
    submission.addDeclinationStep(
      event.payload.actor,
      'Has been manually declined',
    )
    submission.addCompletionStep(
      event.payload.actor,
      'Has been manually declined',
    )
  }
}
