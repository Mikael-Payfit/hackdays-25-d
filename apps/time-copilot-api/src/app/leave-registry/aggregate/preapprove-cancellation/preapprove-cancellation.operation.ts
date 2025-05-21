import { generateNewEntityId } from '../../../common/helpers/uuid';
import { Actor } from '../../../common/models';
import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface';
import { Submission } from '../core/value-objects';
import {
  CancellationPreapprovedEvent,
  CancellationPreapprovedPayload,
} from './cancellation-preapproved.event';

export type PreapproveCancellationInput = {
  actor: Actor;
  leaveRecordId: string;
};

export type PreapproveCancellationOutput = {
  submissionId: string;
};

export function preapproveCancellation(
  aggregate: ILeaveRegistryAggregate,
  { actor, leaveRecordId }: PreapproveCancellationInput
): PreapproveCancellationOutput {
  // Creation of the preapproved cancellation submission
  const submissionId: string = generateNewEntityId();

  aggregate.applyBeforePersist([
    new CancellationPreapprovedEvent(
      aggregate.getLeaveRegistryId(),
      new CancellationPreapprovedPayload({
        submissionId,
        leaveRegistryId: aggregate.getLeaveRegistryId(),
        leaveRegistryVersion: aggregate.getVersion(),
        actor,
      })
    ),
  ]);

  // check if the last submission for the leave record is open
  const oldSubmission: Submission | undefined =
    aggregate.getLastOpenSubmissionForLeaveRecord({
      leaveRecordId,
    });

  if (oldSubmission) {
    // Check if leave record is the only one not completed leave in the submission
    if (
      aggregate.isLeaveRecordLastOneNotCompletedForSubmission({
        leaveRecordId,
        submissionId: oldSubmission.id,
      })
    ) {
      aggregate.discardSubmission({
        submissionId: oldSubmission.id,
        actor,
      });
    }
  }

  aggregate.cancelLeaveRecord({
    submissionId,
    actor,
    leaveRecordId,
  });

  return { submissionId };
}
