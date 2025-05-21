import { AggregateRepository } from '@payfit/common-time-model'

import { WorkschedulePatternRegistryAggregate } from './workschedule-pattern-registry.aggregate'

export const WORKSCHEDULE_PATTERN_REGISTRY_REPOSITORY =
  'WORKSCHEDULE_PATTERN_REGISTRY_REPOSITORY'

export interface IWorkschedulePatternRegistryRepository
  extends AggregateRepository<WorkschedulePatternRegistryAggregate> {
  resetWorkschedulePatternRegistry(
    workschedulePatternRegistryId: string,
  ): Promise<void>
  save(aggregate: WorkschedulePatternRegistryAggregate): Promise<void>
  getByIdOrThrow(id: string): Promise<WorkschedulePatternRegistryAggregate>
}
