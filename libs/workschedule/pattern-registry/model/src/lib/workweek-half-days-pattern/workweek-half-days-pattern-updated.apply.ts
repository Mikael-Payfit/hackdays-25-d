import { WorkschedulePatternRegistryAggregate } from '../core/workschedule-pattern-registry.aggregate'
import { WorkweekHalfDaysPatternRecordUpdatedEvent } from './workweek-half-days-pattern-updated.event'
import { WorkweekHalfDaysPatternRecord } from './workweek-half-days-pattern.entity'

export function applyWorkweekHalfDaysPatternRecordUpdated(
  aggregate: WorkschedulePatternRegistryAggregate,
  event: WorkweekHalfDaysPatternRecordUpdatedEvent,
) {
  const pattern = aggregate.getPatternById(
    event.payload.workschedulePatternRecordId,
  ) as WorkweekHalfDaysPatternRecord

  if (pattern) {
    pattern.name = event.payload.name
    pattern.description = event.payload.description
    pattern.definition = event.payload.definition
  }
}
