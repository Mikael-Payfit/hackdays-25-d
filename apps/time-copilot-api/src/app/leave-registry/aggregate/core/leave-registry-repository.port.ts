import { LeaveRegistryAggregate } from './leave-registry.aggregate'

export const LEAVE_REGISTRY_REPOSITORY = 'LEAVE_REGISTRY_REPOSITORY'

export interface ILeaveRegistryRepository {
  save(aggregate: LeaveRegistryAggregate): Promise<void>

  initializeLeaveRegistryAggregate({
    jlCompanyId,
    jlContractId,
  }: {
    jlCompanyId: string
    jlContractId: string
  }): Promise<LeaveRegistryAggregate>

  getLeaveRegistryAggregateByJlContractId({
    jlContractId,
    jlCompanyId,
    transactionalTime,
    effectiveTime,
  }: {
    jlContractId: string
    jlCompanyId: string
    transactionalTime?: number
    effectiveTime?: number
  }): Promise<LeaveRegistryAggregate>

  getLeaveRegistryAggregateByLeaveRegistryId({
    leaveRegistryId,
    jlContractId,
    jlCompanyId,
    transactionalTime,
    effectiveTime,
  }: {
    leaveRegistryId: string
    jlContractId?: string
    jlCompanyId?: string
    transactionalTime?: number
    effectiveTime?: number
  }): Promise<LeaveRegistryAggregate>
}
