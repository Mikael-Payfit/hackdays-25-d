import { LeaveRegistryAggregate } from '../core/leave-registry.aggregate'
import { Submission, SubmissionTypeHelper } from '../core/value-objects'
import { CancellationPreapprovedEvent } from './cancellation-preapproved.event'

export function applyCancellationPreapproved(
  aggregate: LeaveRegistryAggregate,
  event: CancellationPreapprovedEvent,
): void {
  if (
    !aggregate
      .getDataStore()
      .submissions.find((s) => s.id === event.payload.submissionId)
  ) {
    const submission = new Submission({
      submissionId: event.payload.submissionId,
      type: SubmissionTypeHelper.preapprovedCancellation(),
      leaveRecordIds: [],
      steps: [],
    })
    submission.addInitialisationStep(
      event.payload.actor,
      'Preapproved Cancellation',
    )
    submission.addApprovalStep(event.payload.actor, 'Preapproved Cancellation')
    submission.addCompletionStep(
      event.payload.actor,
      'Preapproved Cancellation',
    )
    aggregate.getDataStore().submissions.push(submission)
  }
}
