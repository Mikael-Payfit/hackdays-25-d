import { EmployeeWorkscheduleRegistryAggregate } from '../core'
import { WorkschedulePatternRecordAssociatedToEmployeeWorkscheduleRegistryEvent } from './workschedule-pattern-associated-to-employee-registry.event'

export function applyWorkschedulePatternRecordAssociatedToEmployeeWorkscheduleRegistry(
  aggregate: EmployeeWorkscheduleRegistryAggregate,
  event: WorkschedulePatternRecordAssociatedToEmployeeWorkscheduleRegistryEvent,
) {
  aggregate.dataStore.workschedulePatternAssociations.push({
    workschedulePatternRegistryId: event.payload.workschedulePatternRegistryId,
    workschedulePatternRegistryVersion:
      event.payload.workschedulePatternRegistryVersion,
    workschedulePatternRecordId: event.payload.workschedulePatternRecordId,
    validityPeriod: event.payload.validityPeriod,
  })
}
