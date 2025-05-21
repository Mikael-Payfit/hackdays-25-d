import { Actor } from '@payfit/common-time-model'
import { CompanyDigestAggregate } from '../core'
import {
  LunchTimeDefinedEvent,
  LunchTimeDefinedPayload,
} from './lunch-break-time-defined.event'
import { IDayLunchTime } from './lunch-break-time.models'

export type DefineLunchBreakTimeInput = {
  week: IDayLunchTime[]
  actor: Actor
}

export function defineLunchBreakTime(
  aggregate: CompanyDigestAggregate,
  input: DefineLunchBreakTimeInput,
): void {
  aggregate.applyBeforePersist([
    new LunchTimeDefinedEvent(
      aggregate.id,
      new LunchTimeDefinedPayload({
        companyDigestId: aggregate.id,
        week: input.week,
        actor: input.actor,
      }),
    ),
  ])
}
