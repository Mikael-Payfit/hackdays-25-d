export const EMPLOYEE_WORKSCHEDULE_REGISTRY_EXTERNAL_MAPPINGS_REPOSITORY =
  'EMPLOYEE_WORKSCHEDULE_REGISTRY_EXTERNAL_MAPPINGS_REPOSITORY'

export enum EmployeeWorkscheduleIdTypes {
  JL_CONTRACT_ID = 'jlContractId',
  JL_COMPANY_ID = 'jlCompanyId',
  EMPLOYEE_WORKSCHEDULE_REGISTRY_ID = 'employeeWorkscheduleRegistryId',
}

export interface IEmployeeWorkscheduleRegistryExternalMappingsRepository {
  mapJLContractId({
    jlContractId,
    employeeWorkscheduleRegistryId,
  }: {
    jlContractId: string
    employeeWorkscheduleRegistryId: string
  }): Promise<void>
  mapJLCompanyId({
    jlCompanyId,
    employeeWorkscheduleRegistryId,
  }: {
    jlCompanyId: string
    employeeWorkscheduleRegistryId: string
  }): Promise<void>
  getEmployeeWorkscheduleRegistryIdByJLContractId(
    jlContractId: string,
  ): Promise<string | undefined>
  getJLContractIdByEmployeeWorkscheduleRegistryId(
    employeeWorkscheduleRegistryId: string,
  ): Promise<string | undefined>
  getEmployeeWorkscheduleRegistryIdsByJLCompanyId(
    jlCompanyId: string,
  ): Promise<string[]>
  getJLCompanyIdByEmployeeWorkscheduleRegistryId(
    employeeWorkscheduleRegistryId: string,
  ): Promise<string | undefined>
}
