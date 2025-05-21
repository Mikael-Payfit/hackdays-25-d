/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Aggregate,
  DatePeriodHelper,
  generateNewEntityId,
  ISOFormatDate,
} from '@payfit/common-time-model'
import { IEdpEvent } from '@payfit/edp-models'
import { EdpBasePayloadEvent } from '@payfit/edp-sdk'
import {
  applyWorkschedulePatternRecordAssociatedToEmployeeWorkscheduleRegistry,
  associateWorkschedulePattern,
  AssociateWorkschedulePatternInput,
  WorkschedulePatternRecordAssociatedToEmployeeWorkscheduleRegistryEvent,
} from '../associate-workschedule-pattern'
import {
  applyWorkschedulePatternRecordUpdated,
  updateWorkschedulePatternAssociation,
  UpdateWorkschedulePatternAssociationInput,
  WorkschedulePatternAssociationUpdatedEvent,
} from '../update-workschedule-pattern-association'
import { IEmployeeWorkscheduleRegistryAggregate } from './employee-workschedule-registry-aggregate.interface'
import {
  EmployeeWorkscheduleRegistryInitializedEvent,
  EmployeeWorkscheduleRegistryInitializedPayload,
} from './employee-workschedule-registry-initialized.event'
import { EmployeeWorkscheduleRegistryPrivateEventEnum } from './employee-workschedule-registry-private-event-enum'
import { EmployeeWorkscheduleRegistry } from './employee-workschedule-registry.entity'

export class EmployeeWorkscheduleRegistryAggregate
  extends Aggregate<EmployeeWorkscheduleRegistry>
  implements IEmployeeWorkscheduleRegistryAggregate
{
  private constructor({
    id,
    initialState,
  }: {
    id: string
    initialState: EmployeeWorkscheduleRegistry
  }) {
    const dataStore = structuredClone(initialState)
    super(id, dataStore)
  }

  getWorkschedulePatternRecordIdByDate(
    date: ISOFormatDate,
  ): string | undefined {
    const association = this.dataStore.workschedulePatternAssociations.find(
      (association) => {
        const period = association.validityPeriod
        const datePeriod = { startDate: date, endDate: date }
        return (
          !DatePeriodHelper.isBefore(datePeriod, period) &&
          !DatePeriodHelper.isAfter(datePeriod, period)
        )
      },
    )

    return association?.workschedulePatternRecordId
  }

  static hydrate({
    id,
    initialState,
    events,
  }: {
    id: string
    initialState: EmployeeWorkscheduleRegistry
    events: IEdpEvent<EdpBasePayloadEvent>[]
  }): EmployeeWorkscheduleRegistryAggregate {
    const aggregate = new EmployeeWorkscheduleRegistryAggregate({
      id,
      initialState,
    })

    if (events.length > 0) {
      aggregate.apply(events)
      aggregate.hydrated = true
    }

    return aggregate
  }

  static createNew(): EmployeeWorkscheduleRegistryAggregate {
    const id = generateNewEntityId()
    const aggregate = new EmployeeWorkscheduleRegistryAggregate({
      id,
      initialState: new EmployeeWorkscheduleRegistry(id),
    })

    aggregate.applyBeforePersist([
      new EmployeeWorkscheduleRegistryInitializedEvent(
        aggregate.id,
        new EmployeeWorkscheduleRegistryInitializedPayload({
          employeeWorkscheduleRegistryId: aggregate.id,
        }),
      ),
    ])

    return aggregate
  }

  protected apply(events: IEdpEvent<EdpBasePayloadEvent>[]): void {
    for (const event of events) {
      switch (event.eventType) {
        case EmployeeWorkscheduleRegistryPrivateEventEnum.WORKSCHEDULE_PATTERN_ASSOCIATED_TO_EMPLOYEE_WORKSCHEDULE_REGISTRY:
          applyWorkschedulePatternRecordAssociatedToEmployeeWorkscheduleRegistry(
            this,
            event as WorkschedulePatternRecordAssociatedToEmployeeWorkscheduleRegistryEvent,
          )
          this.lastEventApplied = event
          break
        case EmployeeWorkscheduleRegistryPrivateEventEnum.WORKSCHEDULE_PATTERN_ASSOCIATION_UPDATED:
          applyWorkschedulePatternRecordUpdated(
            this,
            event as WorkschedulePatternAssociationUpdatedEvent,
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

  public associateWorkschedulePattern(
    workschedulePatternAssociation: AssociateWorkschedulePatternInput,
  ): void {
    return associateWorkschedulePattern(this, workschedulePatternAssociation)
  }

  public updateWorkschedulePatternAssociation(
    workschedulePatternAssociation: UpdateWorkschedulePatternAssociationInput,
  ): void {
    return updateWorkschedulePatternAssociation(
      this,
      workschedulePatternAssociation,
    )
  }
}
