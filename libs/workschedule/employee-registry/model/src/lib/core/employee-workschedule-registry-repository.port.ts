import { AggregateRepository } from '@payfit/common-time-model'

import { EmployeeWorkscheduleRegistryAggregate } from './employee-workschedule-registry.aggregate'

export const EMPLOYEE_WORKSCHEDULE_REGISTRY_REPOSITORY =
  'EMPLOYEE_WORKSCHEDULE_REGISTRY_REPOSITORY'

export interface IEmployeeWorkscheduleRegistryRepository
  extends AggregateRepository<EmployeeWorkscheduleRegistryAggregate> {
  resetEmployeeWorkscheduleRegistry(
    employeeWorkscheduleRegistryId: string,
  ): Promise<void>
  save(aggregate: EmployeeWorkscheduleRegistryAggregate): Promise<void>
  getByIdOrThrow(id: string): Promise<EmployeeWorkscheduleRegistryAggregate>
}
