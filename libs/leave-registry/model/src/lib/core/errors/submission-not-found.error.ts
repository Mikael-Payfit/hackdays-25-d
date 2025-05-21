import { BusinessError } from '@payfit/common-time-model'

export class SubmissionNotFoundError extends BusinessError {
  constructor(submissionId: string) {
    super(`No submission found for submissionId ${submissionId}`)
  }
}
