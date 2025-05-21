import {
  CompanyDigestAggregate,
  DefaultWorkschedulePatternDefinedEvent,
} from '../core'

export function applyDefaultWorkschedulePatternDefined(
  aggregate: CompanyDigestAggregate,
  event: DefaultWorkschedulePatternDefinedEvent,
) {
  aggregate.dataStore.defaultWorkschedulePattern = {
    workschedulePatternRecordId: event.payload.workschedulePatternRecordId,
    workschedulePatternRegistryId: event.payload.workschedulePatternRegistryId,
    workschedulePatternRegistryVersion:
      event.payload.workschedulePatternRegistryVersion,
  }
}
