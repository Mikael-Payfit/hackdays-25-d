import { generateNewEntityId } from '../../../common/helpers/uuid';
import { Actor } from '../../../common/models';
import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface';
import { LeavePeriod } from '../core/value-objects/leave-period';
import { LeaveType } from '../core/value-objects/leave-type';
import {
  PreapprovedRegistrationSubmittedEvent,
  PreapprovedRegistrationSubmittedPayload,
} from './preapproved-registration-submitted.event';
export type SubmitPreapprovedRegistrationInput = {
  newLeavePeriod: LeavePeriod;
  newLeaveType: LeaveType;
  actor: Actor;
};

export type SubmitPreapprovedRegistrationOutput = {
  submissionId: string;
  leaveRecordId: string;
};

export function submitPreapprovedRegistration(
  aggregate: ILeaveRegistryAggregate,
  { newLeavePeriod, newLeaveType, actor }: SubmitPreapprovedRegistrationInput
): SubmitPreapprovedRegistrationOutput {
  // Creation of the preapproved submission
  const submissionId = generateNewEntityId();
  aggregate.applyBeforePersist([
    new PreapprovedRegistrationSubmittedEvent(
      aggregate.getLeaveRegistryId(),
      new PreapprovedRegistrationSubmittedPayload({
        submissionId,
        leaveRegistryId: aggregate.getLeaveRegistryId(),
        leaveRegistryVersion: aggregate.getVersion(),
        actor,
      })
    ),
  ]);

  const { leaveRecordId } = aggregate.requestLeaveRecord({
    actor,
    leavePeriod: newLeavePeriod,
    leaveType: newLeaveType,
    submissionId,
  });

  aggregate.registerLeaveRecord({
    actor,
    leaveRecordId,
    submissionId,
  });

  return { submissionId, leaveRecordId };
}
