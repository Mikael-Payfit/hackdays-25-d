import { ILeaveRegistryAggregate } from '../leave-registry.aggregate.interface'
import { Submission } from '../value-objects'

export type GetLastOpenSubmissionForLeaveRecordInput = {
  leaveRecordId: string
}

export function getLastOpenSubmissionForLeaveRecordFilter(
  aggregate: ILeaveRegistryAggregate,
  { leaveRecordId }: GetLastOpenSubmissionForLeaveRecordInput,
): Submission | undefined {
  const submissions: Submission[] = [
    ...aggregate.getOpenSubmissionsForLeaveRecord({ leaveRecordId }),
  ]
  if (submissions.length > 0) {
    return submissions.pop()
  }
  return undefined
}
