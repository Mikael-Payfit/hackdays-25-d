import {
  Actor,
  DatePeriodHelper,
  DatePeriodWithoutEnd,
} from '@payfit/common-time-model'
import { EmployeeWorkscheduleRegistryAggregate } from '../core'
import { ApplicationPeriodOverlapExistingWorkschedulePatternError } from '../core/errors/application-period-overlap-existing-workschedule-pattern'
import { PatternAlreadyAssociatedError } from '../core/errors/pattern-already-associated.error'
import {
  WorkschedulePatternRecordAssociatedToEmployeeWorkscheduleRegistryEvent,
  WorkschedulePatternRecordAssociatedToEmployeeWorkscheduleRegistryPayload,
} from './workschedule-pattern-associated-to-employee-registry.event'

export type AssociateWorkschedulePatternInput = {
  workschedulePatternRegistryId: string
  workschedulePatternRegistryVersion: number
  workschedulePatternRecordId: string
  validityPeriod: DatePeriodWithoutEnd
  actor: Actor
}

export function associateWorkschedulePattern(
  aggregate: EmployeeWorkscheduleRegistryAggregate,
  input: AssociateWorkschedulePatternInput,
): void {
  for (const association of aggregate.dataStore
    .workschedulePatternAssociations) {
    if (
      association.workschedulePatternRecordId ===
        input.workschedulePatternRecordId &&
      association.workschedulePatternRegistryVersion ===
        input.workschedulePatternRegistryVersion
    ) {
      throw new PatternAlreadyAssociatedError(
        input.workschedulePatternRegistryId,
        input.workschedulePatternRegistryVersion,
        input.workschedulePatternRecordId,
      )
    }

    if (
      DatePeriodHelper.isOverlapping(
        association.validityPeriod,
        input.validityPeriod,
      )
    ) {
      throw new ApplicationPeriodOverlapExistingWorkschedulePatternError(
        input.validityPeriod,
      )
    }
  }

  aggregate.applyBeforePersist([
    new WorkschedulePatternRecordAssociatedToEmployeeWorkscheduleRegistryEvent(
      aggregate.id,
      new WorkschedulePatternRecordAssociatedToEmployeeWorkscheduleRegistryPayload(
        {
          employeeWorkscheduleRegistryId: aggregate.id,
          workschedulePatternRecordId: input.workschedulePatternRecordId,
          workschedulePatternRegistryId: input.workschedulePatternRegistryId,
          workschedulePatternRegistryVersion:
            input.workschedulePatternRegistryVersion,
          validityPeriod: input.validityPeriod,
          actor: input.actor,
        },
      ),
    ),
  ])
}
