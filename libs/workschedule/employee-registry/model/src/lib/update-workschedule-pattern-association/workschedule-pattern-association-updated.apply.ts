import { EmployeeWorkscheduleRegistryAggregate } from '../core'
import { WorkschedulePatternAssociationUpdatedEvent } from './workschedule-pattern-association-updated.event'

export function applyWorkschedulePatternRecordUpdated(
  aggregate: EmployeeWorkscheduleRegistryAggregate,
  event: WorkschedulePatternAssociationUpdatedEvent,
): void {
  const existingAssociation =
    aggregate.dataStore.workschedulePatternAssociations.find(
      (association) =>
        association.workschedulePatternRecordId ===
        event.payload.workschedulePatternRecordId,
    )

  if (existingAssociation) {
    existingAssociation.workschedulePatternRegistryVersion =
      event.payload.workschedulePatternRegistryVersion
    existingAssociation.validityPeriod = event.payload.validityPeriod
  }
}
