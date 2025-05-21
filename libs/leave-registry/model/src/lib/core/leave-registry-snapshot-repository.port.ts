import { ILeaveRegistry } from './value-objects'

export const LEAVE_REGISTRY_SNAPSHOT_REPOSITORY =
  'LEAVE_REGISTRY_SNAPSHOT_REPOSITORY'

export interface ILeaveRegistrySnapshotRepository {
  getInitialSnapshot({
    jlContractId,
    leaveRegistryId,
  }: {
    jlContractId?: string
    leaveRegistryId: string
  }): Promise<ILeaveRegistry>
}
