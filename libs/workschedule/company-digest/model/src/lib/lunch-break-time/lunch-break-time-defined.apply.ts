import { CompanyDigestAggregate } from '../core'
import { LunchTimeDefinedEvent } from './lunch-break-time-defined.event'

export function applyLunchTimeDefined(
  aggregate: CompanyDigestAggregate,
  event: LunchTimeDefinedEvent,
) {
  event.payload.week.map((day) => {
    const dayParams = aggregate.dataStore.weekParams.find(
      (d) => d.day === day.day,
    )
    if (dayParams) {
      dayParams.lunchBreakTimeSlot = day.timeSlot
    }
  })
}
