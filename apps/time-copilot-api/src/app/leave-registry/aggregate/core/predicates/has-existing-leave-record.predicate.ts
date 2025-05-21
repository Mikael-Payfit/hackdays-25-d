import { ILeaveRegistryAggregate } from '../leave-registry.aggregate.interface'

export type HasExistingLeaveRecordInput = {
  leaveRecordId: string
}

export const hasExistingLeaveRecord = (
  aggregate: ILeaveRegistryAggregate,
  { leaveRecordId }: HasExistingLeaveRecordInput,
): boolean => {
  return aggregate
    .getDataStore()
    .leaveRecords.some((record) => record.id === leaveRecordId)
}
