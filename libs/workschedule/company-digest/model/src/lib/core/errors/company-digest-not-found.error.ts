import { BusinessError } from '@payfit/common-time-model'

export class CompanyDigestNotFoundError extends BusinessError {
  constructor() {
    super('Company Digest not found')
  }
}
