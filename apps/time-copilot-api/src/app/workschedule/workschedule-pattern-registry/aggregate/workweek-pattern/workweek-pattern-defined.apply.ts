import { WorkschedulePatternRegistryAggregate } from '../core/workschedule-pattern-registry.aggregate'
import { WorkweekPatternRecordDefinedEvent } from './workweek-pattern-defined.event'
import { WorkweekPatternRecord } from './workweek-pattern.entity'

export function applyWorkweekPatternRecordDefined(
  aggregate: WorkschedulePatternRegistryAggregate,
  event: WorkweekPatternRecordDefinedEvent,
) {
  aggregate.dataStore.push(
    new WorkweekPatternRecord({
      id: event.payload.workschedulePatternRecordId,
      name: event.payload.name,
      description: event.payload.description,
      definition: event.payload.definition,
    }),
  )
}
