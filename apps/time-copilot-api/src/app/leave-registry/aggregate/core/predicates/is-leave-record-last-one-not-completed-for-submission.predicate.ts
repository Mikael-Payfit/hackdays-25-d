import { ILeaveRegistryAggregate } from '../leave-registry.aggregate.interface'

export type IsLeaveRecordLastOneNotCompletedForSubmissionInput = {
  submissionId: string
  leaveRecordId: string
}

export const isLeaveRecordLastOneNotCompletedForSubmission = (
  aggregate: ILeaveRegistryAggregate,
  {
    submissionId,
    leaveRecordId,
  }: IsLeaveRecordLastOneNotCompletedForSubmissionInput,
): boolean => {
  const submission = aggregate.getSubmission(submissionId)
  if (!submission) return false

  const ongoingRecordIds = submission.leaveRecordIds.filter((recordId) => {
    const record = aggregate.getLeaveRecordByLeaveRecordId(recordId)
    return record && record.isOngoing() && record.id !== leaveRecordId
  })

  return ongoingRecordIds.length > 0
}
