import { ILeaveRegistryAggregate } from '../leave-registry.aggregate.interface'
import { Submission } from '../value-objects'

export type GetOpenSubmissionForLeaveRecordInput = {
  leaveRecordId: string
}

export function getOpenSubmissionForLeaveRecordFilter(
  aggregate: ILeaveRegistryAggregate,
  { leaveRecordId }: GetOpenSubmissionForLeaveRecordInput,
): Submission[] {
  return aggregate
    .getDataStore()
    .submissions.filter(
      (submission) =>
        submission.hasLeaveRecordId(leaveRecordId) && submission.isOpen(),
    )
}
