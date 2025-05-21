/* eslint-disable @typescript-eslint/no-explicit-any */
import { Aggregate } from '@payfit/common-time-model'
import { IEdpEvent } from '@payfit/edp-models'
import { EdpBasePayloadEvent } from '@payfit/edp-sdk'
import { applyDefaultWorkschedulePatternDefined } from '../default-workschedule-pattern'
import {
  CompanyDigestDefaultWorkschedulePatternDefinedPayload,
  DefaultWorkschedulePatternDefinedEvent,
} from '../default-workschedule-pattern/default-workschedule-pattern-defined.event'
import { LunchTimeDefinedEvent } from '../lunch-break-time'
import {
  DefineLunchBreakTimeInput,
  defineLunchBreakTime,
} from '../lunch-break-time/define-lunch-break-time.operation'
import { applyLunchTimeDefined } from '../lunch-break-time/lunch-break-time-defined.apply'
import {
  CompanyDigestInitializedEvent,
  CompanyDigestInitializedPayload,
} from './company-digest-initialized.event'
import { CompanyDigestPrivateEventEnum } from './company-digest-private-event-enum'
import { CompanyDigestDatastore } from './company-digest.datastore'
export class CompanyDigestAggregate extends Aggregate<CompanyDigestDatastore> {
  private constructor({
    id,
    initialState,
  }: {
    id: string
    initialState: CompanyDigestDatastore
  }) {
    const dataStore = structuredClone(initialState)
    super(id, dataStore)
  }

  static hydrate({
    id,
    initialState,
    events,
  }: {
    id: string
    initialState: CompanyDigestDatastore
    events: IEdpEvent<EdpBasePayloadEvent>[]
  }): CompanyDigestAggregate {
    const aggregate = new CompanyDigestAggregate({
      id,
      initialState,
    })

    if (events.length > 0) {
      aggregate.apply(events)
      aggregate.hydrated = true
    }

    return aggregate
  }

  static createNew(
    companyDigestId: string,
    initialState: CompanyDigestDatastore,
  ): CompanyDigestAggregate {
    const aggregate = new CompanyDigestAggregate({
      id: companyDigestId,
      initialState,
    })

    aggregate.applyBeforePersist([
      new CompanyDigestInitializedEvent(
        aggregate.id,
        new CompanyDigestInitializedPayload({
          companyDigestId: aggregate.id,
        }),
      ),
    ])

    return aggregate
  }

  protected apply(events: IEdpEvent<EdpBasePayloadEvent>[]): void {
    for (const event of events) {
      switch (event.eventType) {
        case CompanyDigestPrivateEventEnum.LUNCH_BREAK_DEFINED:
          applyLunchTimeDefined(this, event as LunchTimeDefinedEvent)
          this.lastEventApplied = event
          break
        case CompanyDigestPrivateEventEnum.DEFAULT_WORKSCHEDULE_PATTERN_DEFINED:
          applyDefaultWorkschedulePatternDefined(
            this,
            event as DefaultWorkschedulePatternDefinedEvent,
          )
          this.lastEventApplied = event
          break
        default:
          break
      }
    }
  }

  protected isConsistent(): boolean {
    return true
  }

  public defineLunchBreakTime(input: DefineLunchBreakTimeInput): void {
    return defineLunchBreakTime(this, input)
  }

  public assignDefaultWorkschedulePattern(input: {
    workschedulePatternRecordId: string
    workschedulePatternRegistryId: string
    workschedulePatternRegistryVersion: number
  }) {
    const curDefWorkschedulePattern = this.dataStore.defaultWorkschedulePattern

    if (
      curDefWorkschedulePattern?.workschedulePatternRecordId ===
        input.workschedulePatternRecordId &&
      curDefWorkschedulePattern?.workschedulePatternRegistryId ===
        input.workschedulePatternRegistryId &&
      curDefWorkschedulePattern?.workschedulePatternRegistryVersion ===
        input.workschedulePatternRegistryVersion
    ) {
      throw new Error(
        'DefaultWorkschedulePattern already has the provided value',
      )
    }

    this.applyBeforePersist([
      new DefaultWorkschedulePatternDefinedEvent(
        this.id,
        new CompanyDigestDefaultWorkschedulePatternDefinedPayload({
          companyDigestId: this.id,
          ...input,
        }),
      ),
    ])
  }
}
