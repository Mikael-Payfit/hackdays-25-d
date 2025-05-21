export const COMPANY_DIGEST_SNAPSHOT_REPOSITORY =
  'COMPANY_DIGEST_SNAPSHOT_REPOSITORY'

export type CompanyDigestSnapshot = {
  collaborators: {
    collaboratorId: string
    contracts: { jlContractId: string }[]
  }[]
}

export interface ICompanyDigestSnapshotRepository {
  getOrCreateInitialSnapshot({
    jlCompanyId,
    companyDigestId
  }: {
    jlCompanyId: string
    companyDigestId: string
  }): Promise<CompanyDigestSnapshot>
}
