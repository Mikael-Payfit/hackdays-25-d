import { generateNewEntityId } from '../../../common/helpers/uuid';
import { Actor } from '../../../common/models';
import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface';
import { LeavePeriod } from '../core/value-objects/leave-period';
import {
  UpdateLeavePeriodPreapprovedEvent,
  UpdateLeavePeriodPreapprovedPayload,
} from './update-leave-period-preapproved.event';

export type PreapproveUpdateLeavePeriodInput = {
  actor: Actor;
  leaveRecordId: string;
  newLeavePeriod: LeavePeriod;
};

export type PreapproveUpdateLeavePeriodOutput = {
  submissionId: string;
};

export function preapproveUpdateLeavePeriod(
  aggregate: ILeaveRegistryAggregate,
  { actor, leaveRecordId, newLeavePeriod }: PreapproveUpdateLeavePeriodInput
): PreapproveUpdateLeavePeriodOutput {
  // Check if the leave is valid
  const submissionId = generateNewEntityId();
  aggregate.applyBeforePersist([
    new UpdateLeavePeriodPreapprovedEvent(
      aggregate.getLeaveRegistryId(),
      new UpdateLeavePeriodPreapprovedPayload({
        submissionId,
        leaveRegistryId: aggregate.getLeaveRegistryId(),
        leaveRegistryVersion: aggregate.getVersion(),
        actor,
      })
    ),
  ]);

  aggregate.updateLeavePeriod({
    leaveRecordId,
    newLeavePeriod,
    submissionId,
    actor,
  });

  return { submissionId };
}
