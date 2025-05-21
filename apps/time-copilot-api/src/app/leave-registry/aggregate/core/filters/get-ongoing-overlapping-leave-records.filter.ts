import { ILeaveRegistryAggregate } from '../leave-registry.aggregate.interface'
import { LeaveRecord } from '../value-objects'
import { LeavePeriod } from '../value-objects/leave-period'

export type GetOngoingOverlappingLeaveRecordsInput = {
  leavePeriod: LeavePeriod
}

export function getOngoingOverlappingLeaveRecordsFilter(
  aggregate: ILeaveRegistryAggregate,
  { leavePeriod }: GetOngoingOverlappingLeaveRecordsInput,
): LeaveRecord[] {
  return aggregate
    .getDataStore()
    .leaveRecords.filter(
      (record) =>
        (record.isOverlapping(leavePeriod) && record.isOngoing()) ?? false,
    )
}
