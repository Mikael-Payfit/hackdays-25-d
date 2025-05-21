import { WorkschedulePatternRegistryAggregate } from '../core/workschedule-pattern-registry.aggregate'
import { WorkweekPatternRecordUpdatedEvent } from './workweek-pattern-updated.event'
import { WorkweekPatternRecord } from './workweek-pattern.entity'

export function applyWorkweekPatternRecordUpdated(
  aggregate: WorkschedulePatternRegistryAggregate,
  event: WorkweekPatternRecordUpdatedEvent,
) {
  const pattern = aggregate.getPatternById(
    event.payload.workschedulePatternRecordId,
  ) as WorkweekPatternRecord

  if (pattern) {
    pattern.name = event.payload.name
    pattern.description = event.payload.description
    pattern.definition = event.payload.definition
  }
}
