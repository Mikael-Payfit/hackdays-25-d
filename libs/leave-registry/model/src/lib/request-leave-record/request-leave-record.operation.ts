import { Actor, generateNewEntityId } from '@payfit/common-time-model'
import { InvalidLeavePeriodError, OverlappingLeaveError } from '../core/errors'
import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface'
import {
  LeavePeriod,
  LeavePeriodHelper,
  LeaveType,
} from '../core/value-objects'
import {
  LeaveRequestedEvent,
  LeaveRequestedPayload,
} from './leave-requested.event'

export type RequestLeaveRecordInput = {
  leaveType: LeaveType
  leavePeriod: LeavePeriod
  actor: Actor
  submissionId: string
}

export type RequestLeaveRecordOutput = {
  leaveRecordId: string
}

export function requestLeaveRecord(
  aggregate: ILeaveRegistryAggregate,
  { leavePeriod, leaveType, actor, submissionId }: RequestLeaveRecordInput,
): RequestLeaveRecordOutput {
  // Check if the leave is valid
  // This rule throw directly an InvalidLeavePeriodError if the leave is not valid
  const leavePeriodValid = LeavePeriodHelper.isValid(leavePeriod)
  if (!leavePeriodValid) {
    throw new InvalidLeavePeriodError(
      LeavePeriodHelper.getInvalidationErrors(leavePeriod),
    )
  }

  // Check if there is some registered overlapping leave in the leaveRegistry overlapping with the new leave
  if (
    aggregate.hasRegisteredOverlappingLeaveRecords({
      leavePeriod,
    })
  ) {
    throw new OverlappingLeaveError()
  }

  const leaveRecordId = generateNewEntityId()
  aggregate.applyBeforePersist([
    new LeaveRequestedEvent(
      aggregate.getLeaveRegistryId(),
      new LeaveRequestedPayload({
        leaveRecordId,
        submissionId,
        leaveRegistryId: aggregate.getLeaveRegistryId(),
        leaveRegistryVersion: aggregate.getVersion(),
        actor,
        type: leaveType.name,
        country: leaveType.country,
        beginDate: leavePeriod.begin.date,
        beginMoment: leavePeriod.begin.moment,
        endDate: leavePeriod.end.date,
        endMoment: leavePeriod.end.moment,
      }),
    ),
  ])

  return {
    leaveRecordId,
  }
}
