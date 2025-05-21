export const LEAVE_REGISTRY_EXTERNAL_MAPPINGS_REPOSITORY =
  'LEAVE_REGISTRY_EXTERNAL_MAPPINGS_REPOSITORY'

export enum LeaveRegistryIdTypes {
  JL_COMPANY_ID = 'jlCompanyId',
  JL_CONTRACT_ID = 'jlContractId',
  HASHTABLE_ROW_ID = 'hashtableRowId',
  LEAVE_REGISTRY_ID = 'leaveRegistryId',
  LEAVE_RECORD_ID = 'leaveRecordId',
}

export enum LeaveRecordIdTypes {
  HASHTABLE_ROW_ID = 'hashtableRowId',
  LEAVE_RECORD_ID = 'leaveRecordId',
}

export interface ILeaveRegistryExternalMappingsRepository {
  mapJLCompanyId({
    jlCompanyId,
    leaveRegistryId,
  }: {
    jlCompanyId: string
    leaveRegistryId: string
  }): Promise<void>
  getLeaveRegistryIdByJLCompanyId(jlCompanyId: string): Promise<string>
  getJLCompanyIdByLeaveRegistryId(leaveRegistryId: string): Promise<string>

  mapJLContractId({
    jlContractId,
    leaveRegistryId,
  }: {
    jlContractId: string
    leaveRegistryId: string
  }): Promise<void>
  getLeaveRegistryIdByJLContractId(jlContractId: string): Promise<string>
  getJLContractIdByLeaveRegistryId(leaveRegistryId: string): Promise<string>

  mapHashtableRowId({
    hashtableRowId,
    leaveRecordId,
  }: {
    hashtableRowId: string
    leaveRecordId: string
  }): Promise<void>
  getLeaveRecordIdByHashtableRowId(hashtableRowId: string): Promise<string>
  getHashtableRowIdByLeaveRecordId(leaveRecordId: string): Promise<string>
}
