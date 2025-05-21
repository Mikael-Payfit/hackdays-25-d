import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface'
import { Submission, SubmissionTypeHelper } from '../core/value-objects'
import { PreapprovedRegistrationSubmittedEvent } from './preapproved-registration-submitted.event'

export function applyPreapprovedRegistrationSubmitted(
  aggregate: ILeaveRegistryAggregate,
  event: PreapprovedRegistrationSubmittedEvent,
): void {
  if (
    !aggregate
      .getDataStore()
      .submissions.find((s) => s.id === event.payload.submissionId)
  ) {
    const submission = new Submission({
      submissionId: event.payload.submissionId,
      type: SubmissionTypeHelper.preapprovedRegistration(),
      leaveRecordIds: [],
      steps: [],
    })
    submission.addInitialisationStep(
      event.payload.actor,
      'Preapproved Registration Submitted',
    )
    submission.addApprovalStep(
      event.payload.actor,
      'Preapproved Registration Submitted',
    )
    submission.addCompletionStep(
      event.payload.actor,
      'Preapproved Registration Submitted',
    )
    aggregate.getDataStore().submissions.push(submission)
  }
}
