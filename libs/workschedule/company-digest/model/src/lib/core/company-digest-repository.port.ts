import { AggregateRepository } from '@payfit/common-time-model'

import { CompanyDigestAggregate } from './company-digest.aggregate'

export const COMPANY_DIGEST_REPOSITORY = 'COMPANY_DIGEST_REPOSITORY'

export interface ICompanyDigestRepository
  extends AggregateRepository<CompanyDigestAggregate> {
  resetCompanyDigest(companyDigestId: string): Promise<void>
  save(aggregate: CompanyDigestAggregate): Promise<void>
  getOrCreateByJLCompanyId(jlCompanyId: string): Promise<CompanyDigestAggregate>
  createCompanyDigest(
    companyDigestId: string,
    jlCompanyId: string,
  ): Promise<CompanyDigestAggregate>
}
