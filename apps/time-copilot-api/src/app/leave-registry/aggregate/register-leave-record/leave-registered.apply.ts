import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface'
import { LeaveStatusHelper } from '../core/value-objects'
import { LeaveRegisteredEvent } from './leave-registered.event'

export function applyLeaveRegistered(
  aggregate: ILeaveRegistryAggregate,
  event: LeaveRegisteredEvent,
) {
  const leaveRecord = aggregate.getLeaveRecordByLeaveRecordId(
    event.payload.leaveRecordId,
  )
  if (leaveRecord) {
    leaveRecord.leaveStatus = LeaveStatusHelper.getRegistered()
  }
}
