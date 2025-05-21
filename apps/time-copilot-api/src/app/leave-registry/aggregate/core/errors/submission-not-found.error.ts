import { BusinessError } from '../../../../common/errors';

export class SubmissionNotFoundError extends BusinessError {
  constructor(submissionId: string) {
    super(`No submission found for submissionId ${submissionId}`);
  }
}
