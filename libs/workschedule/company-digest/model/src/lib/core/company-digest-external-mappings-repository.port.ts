export const COMPANY_DIGEST_EXTERNAL_MAPPINGS_REPOSITORY =
  'COMPANY_DIGEST_EXTERNAL_MAPPINGS_REPOSITORY'

export enum CompanyDigestIdTypes {
  JL_COMPANY_ID = 'jlCompanyId',
  COMPANY_DIGEST_ID = 'companyDigestId',
}

export interface ICompanyDigestExternalMappingsRepository {
  mapJLCompanyId({
    jlCompanyId,
    companyDigestId,
  }: {
    jlCompanyId: string
    companyDigestId: string
  }): Promise<void>
  getCompanyDigestIdByJLCompanyId(
    jlCompanyId: string,
  ): Promise<string | undefined>
  getJLCompanyIdByCompanyDigestId(
    companyDigestId: string,
  ): Promise<string | undefined>
}
