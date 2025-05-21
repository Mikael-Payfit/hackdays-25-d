import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface'
import { Submission, SubmissionTypeHelper } from '../core/value-objects'
import { UpdateLeavePeriodPreapprovedEvent } from './update-leave-period-preapproved.event'

export function applyUpdateLeavePeriodPreapproved(
  aggregate: ILeaveRegistryAggregate,
  event: UpdateLeavePeriodPreapprovedEvent,
): void {
  if (
    !aggregate
      .getDataStore()
      .submissions.find((s) => s.id === event.payload.submissionId)
  ) {
    const submission = new Submission({
      submissionId: event.payload.submissionId,
      type: SubmissionTypeHelper.preapprovedLeavePeriodUpdate(),
      leaveRecordIds: [],
      steps: [],
    })
    submission.addInitialisationStep(
      event.payload.actor,
      'Preapproved Update Period',
    )
    submission.addApprovalStep(event.payload.actor, 'Preapproved Update Period')
    submission.addCompletionStep(
      event.payload.actor,
      'Preapproved Update Period',
    )
    aggregate.getDataStore().submissions.push(submission)
  }
}
