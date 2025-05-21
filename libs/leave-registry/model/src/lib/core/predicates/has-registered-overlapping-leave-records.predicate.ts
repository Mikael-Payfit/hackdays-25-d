import { ILeaveRegistryAggregate } from '../leave-registry.aggregate.interface'
import { LeavePeriod, LeaveRecord } from '../value-objects'

export type HasRegisteredOverlappingLeaveRecordsInput = {
  leavePeriod: LeavePeriod
  excludeLeaveRecordId?: string // Exclude a leave record from the check (for exemple, the leave record we are updating)
}

export const hasRegisteredOverlappingLeaveRecords = (
  aggregate: ILeaveRegistryAggregate,
  {
    leavePeriod,
    excludeLeaveRecordId,
  }: HasRegisteredOverlappingLeaveRecordsInput,
): boolean => {
  return aggregate
    .getDataStore()
    .leaveRecords.some(
      (leaveRecord: LeaveRecord) =>
        !isExcludeLeaveRecord(leaveRecord, excludeLeaveRecordId) &&
        leaveRecord.isOverlapping(leavePeriod) &&
        leaveRecord.isRegistered(),
    )
}

const isExcludeLeaveRecord = (
  leaveRecord: LeaveRecord,
  excludeLeaveRecordId?: string,
): boolean => {
  if (!excludeLeaveRecordId) {
    return false
  }
  return leaveRecord.id === excludeLeaveRecordId
}
