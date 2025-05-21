import { WorkschedulePatternRegistryAggregate } from '../core/workschedule-pattern-registry.aggregate'
import { WorkweekDayPatternRecordUpdatedEvent } from './workweek-day-pattern-updated.event'
import { WorkweekDayPatternRecord } from './workweek-day-pattern.entity'

export function applyWorkweekDayPatternRecordUpdated(
  aggregate: WorkschedulePatternRegistryAggregate,
  event: WorkweekDayPatternRecordUpdatedEvent,
) {
  const pattern = aggregate.getPatternById(
    event.payload.workschedulePatternRecordId,
  ) as WorkweekDayPatternRecord

  if (pattern) {
    pattern.name = event.payload.name
    pattern.description = event.payload.description
    pattern.definition = event.payload.definition
  }
}
