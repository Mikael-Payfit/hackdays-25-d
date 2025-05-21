import { Actor } from '../../../common/models';
import {
  SubmissionNotFoundError,
  SubmissionNotOpenError,
} from '../core/errors';
import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface';
import {
  SubmissionDiscardedEvent,
  SubmissionDiscardedPayload,
} from './submission-discarded.event';

export type DiscardSubmissionInput = {
  actor: Actor;
  submissionId: string;
};

export function discardSubmission(
  aggregate: ILeaveRegistryAggregate,
  { actor, submissionId }: DiscardSubmissionInput
): void {
  const submission = aggregate.getSubmission(submissionId);

  if (!submission) {
    throw new SubmissionNotFoundError(submissionId);
  }

  if (submission.isCompleted()) {
    throw new SubmissionNotOpenError(submissionId);
  }

  aggregate.applyBeforePersist([
    new SubmissionDiscardedEvent(
      aggregate.getLeaveRegistryId(),
      new SubmissionDiscardedPayload({
        submissionId,
        leaveRegistryId: aggregate.getLeaveRegistryId(),
        leaveRegistryVersion: aggregate.getVersion(),
        actor,
      })
    ),
  ]);
}
