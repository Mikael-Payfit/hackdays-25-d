import { WorkschedulePatternRegistryAggregate } from '../core/workschedule-pattern-registry.aggregate'
import { WorkweekDayPatternRecordDefinedEvent } from './workweek-day-pattern-defined.event'
import { WorkweekDayPatternRecord } from './workweek-day-pattern.entity'

export function applyWorkweekDayPatternRecordDefined(
  aggregate: WorkschedulePatternRegistryAggregate,
  event: WorkweekDayPatternRecordDefinedEvent,
) {
  aggregate.dataStore.push(
    new WorkweekDayPatternRecord({
      id: event.payload.workschedulePatternRecordId,
      name: event.payload.name,
      description: event.payload.description,
      definition: event.payload.definition,
    }),
  )
}
