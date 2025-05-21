import { Actor } from '@payfit/common-time-model'
import {
  LeaveRecordNotDraftError,
  LeaveRecordNotFoundError,
} from '../core/errors'
import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface'
import {
  LeaveDiscardedEvent,
  LeaveDiscardedPayload,
} from './leave-discarded.event'

export type DiscardLeaveRecordInput = {
  actor: Actor
  leaveRecordId: string
  submissionId: string
}

export function discardLeaveRecord(
  aggregate: ILeaveRegistryAggregate,
  { leaveRecordId, submissionId, actor }: DiscardLeaveRecordInput,
): void {
  const leaveRecord = aggregate.getLeaveRecordByLeaveRecordId(leaveRecordId)
  if (!leaveRecord) {
    throw new LeaveRecordNotFoundError(leaveRecordId)
  }

  if (!leaveRecord.isDraft()) {
    throw new LeaveRecordNotDraftError(leaveRecordId)
  }

  aggregate.applyBeforePersist([
    new LeaveDiscardedEvent(
      aggregate.getLeaveRegistryId(),
      new LeaveDiscardedPayload({
        leaveRecordId,
        submissionId,
        leaveRegistryId: aggregate.getLeaveRegistryId(),
        leaveRegistryVersion: aggregate.getVersion(),
        actor, //TODO switch to system actor or add comment
      }),
    ),
  ])
}
