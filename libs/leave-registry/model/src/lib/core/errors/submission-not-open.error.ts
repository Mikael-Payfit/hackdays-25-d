import { BusinessError } from '@payfit/common-time-model'

export class SubmissionNotOpenError extends BusinessError {
  constructor(submissionId: string) {
    super(
      `Trying to discard/dismiss a submission that is not open for submissionId ${submissionId}`,
    )
  }
}
