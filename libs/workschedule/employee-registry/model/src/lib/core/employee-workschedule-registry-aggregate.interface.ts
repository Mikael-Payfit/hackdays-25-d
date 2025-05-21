import { AssociateWorkschedulePatternInput } from '../associate-workschedule-pattern'

export interface IEmployeeWorkscheduleRegistryAggregate {
  associateWorkschedulePattern(
    workschedulePatternAssociation: AssociateWorkschedulePatternInput,
  ): void
}
