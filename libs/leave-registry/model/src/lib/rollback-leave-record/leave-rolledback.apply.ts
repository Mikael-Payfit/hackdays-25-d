/* eslint-disable @typescript-eslint/no-explicit-any */
import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface'
import { LeavePeriod, LeaveStatus, LeaveType } from '../core/value-objects'
import { LeaveRolledbackEvent } from './leave-rolledback.event'

export function applyLeaveRolledback(
  aggregate: ILeaveRegistryAggregate,
  event: LeaveRolledbackEvent,
): void {
  const leaveRecord = aggregate.getLeaveRecordByLeaveRecordId(
    event.payload.leaveRecordId,
  )

  if (leaveRecord) {
    for (const value of event.payload.rolledbackValues) {
      switch (value.key) {
        case 'leavePeriod':
          leaveRecord.leavePeriod = value.restoredValue as LeavePeriod
          break
        case 'leaveType':
          leaveRecord.leaveType = value.restoredValue as LeaveType
          break
        case 'leaveStatus':
          leaveRecord.leaveStatus = value.restoredValue as LeaveStatus
          break
      }
    }
  }
}
