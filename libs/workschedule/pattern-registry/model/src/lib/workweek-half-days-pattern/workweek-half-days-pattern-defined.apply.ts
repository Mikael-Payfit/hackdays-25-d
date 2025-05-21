import { WorkschedulePatternRegistryAggregate } from '../core/workschedule-pattern-registry.aggregate'
import { WorkweekHalfDaysPatternRecordDefinedEvent } from './workweek-half-days-pattern-defined.event'
import { WorkweekHalfDaysPatternRecord } from './workweek-half-days-pattern.entity'

export function applyWorkweekHalfDaysPatternRecordDefined(
  aggregate: WorkschedulePatternRegistryAggregate,
  event: WorkweekHalfDaysPatternRecordDefinedEvent,
) {
  aggregate.dataStore.push(
    new WorkweekHalfDaysPatternRecord({
      id: event.payload.workschedulePatternRecordId,
      name: event.payload.name,
      description: event.payload.description,
      definition: event.payload.definition,
    }),
  )
}
