import { Actor } from '@payfit/common-time-model'
import { LeaveRecordNotFoundError } from '../core/errors'
import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface'
import {
  LeaveDismissedEvent,
  LeaveDismissedPayload,
} from './leave-dismissed.event'

export type DismissLeaveRecordInput = {
  leaveRecordId: string
  actor: Actor
}

export function dismissLeaveRecord(
  aggregate: ILeaveRegistryAggregate,
  { leaveRecordId, actor }: DismissLeaveRecordInput,
): void {
  if (!aggregate.hasExistingLeaveRecord({ leaveRecordId })) {
    throw new LeaveRecordNotFoundError(leaveRecordId)
  }

  aggregate.applyBeforePersist([
    new LeaveDismissedEvent(
      aggregate.getLeaveRegistryId(),
      new LeaveDismissedPayload({
        leaveRecordId,
        leaveRegistryId: aggregate.getLeaveRegistryId(),
        leaveRegistryVersion: aggregate.getVersion(),
        actor,
      }),
    ),
  ])
}
