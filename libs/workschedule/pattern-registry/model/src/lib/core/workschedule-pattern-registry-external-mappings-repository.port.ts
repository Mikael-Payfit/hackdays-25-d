export const WORKSCHEDULE_PATTERN_REGISTRY_EXTERNAL_MAPPINGS_REPOSITORY =
  'WORKSCHEDULE_PATTERN_REGISTRY_EXTERNAL_MAPPINGS_REPOSITORY'

export enum WorkschedulePatternIdTypes {
  JL_COMPANY_ID = 'jlCompanyId',
  WORKSCHEDULE_PATTERN_REGISTRY_ID = 'workschedulePatternRegistryId',
}

export interface IWorkschedulePatternRegistryExternalMappingsRepository {
  mapJLCompanyId({
    jlCompanyId,
    workschedulePatternRegistryId,
  }: {
    jlCompanyId: string
    workschedulePatternRegistryId: string
  }): Promise<void>
  getWorkschedulePatternRegistryIdByJLCompanyId(
    jlCompanyId: string,
  ): Promise<string | undefined>
  getJLCompanyIdByWorkschedulePatternRegistryId(
    workschedulePatternRegistryId: string,
  ): Promise<string | undefined>
}
