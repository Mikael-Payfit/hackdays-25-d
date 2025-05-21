import {
  Actor,
  DatePeriodHelper,
  DatePeriodWithoutEnd,
} from '@payfit/common-time-model'
import { WorkschedulePatternAssociation } from '../associate-workschedule-pattern'
import {
  ApplicationPeriodOverlapExistingWorkschedulePatternError,
  EmployeeWorkscheduleRegistryAggregate,
  PatternAlreadyAssociatedError,
} from '../core'
import { PatternAssociationNotFoundError } from '../core/errors/pattern-association-not-found.error'
import {
  WorkschedulePatternAssociationUpdatedEvent,
  WorkschedulePatternAssociationUpdatedPayload,
} from './workschedule-pattern-association-updated.event'

export type UpdateWorkschedulePatternAssociationInput = {
  workschedulePatternRegistryVersion: number
  workschedulePatternRecordId: string
  actor: Actor
  workschedulePatternRegistryId: string
  validityPeriod?: DatePeriodWithoutEnd
}

export function updateWorkschedulePatternAssociation(
  aggregate: EmployeeWorkscheduleRegistryAggregate,
  input: UpdateWorkschedulePatternAssociationInput,
): void {
  const existingAssociation =
    aggregate.dataStore.workschedulePatternAssociations.find(
      (association) =>
        association.workschedulePatternRecordId ===
        input.workschedulePatternRecordId,
    )

  if (!existingAssociation) {
    throw new PatternAssociationNotFoundError(input.workschedulePatternRecordId)
  }

  if (isEqualAssociation(existingAssociation, input)) {
    throw new PatternAlreadyAssociatedError(
      input.workschedulePatternRegistryId,
      input.workschedulePatternRegistryVersion,
      input.workschedulePatternRecordId,
    )
  }

  if (input.validityPeriod) {
    for (const association of aggregate.dataStore
      .workschedulePatternAssociations) {
      if (
        association.workschedulePatternRecordId !==
          input.workschedulePatternRecordId &&
        association.workschedulePatternRegistryVersion !==
          input.workschedulePatternRegistryVersion
      ) {
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
    }
  }

  aggregate.applyBeforePersist([
    new WorkschedulePatternAssociationUpdatedEvent(
      aggregate.id,
      new WorkschedulePatternAssociationUpdatedPayload({
        employeeWorkscheduleRegistryId: aggregate.id,
        workschedulePatternRegistryId: input.workschedulePatternRegistryId,
        workschedulePatternRecordId: input.workschedulePatternRecordId,
        workschedulePatternRegistryVersion:
          input.workschedulePatternRegistryVersion,
        validityPeriod:
          input.validityPeriod || existingAssociation.validityPeriod,
        actor: input.actor,
      }),
    ),
  ])
}

function isEqualAssociation(
  existingAssociation: WorkschedulePatternAssociation,
  input: UpdateWorkschedulePatternAssociationInput,
): boolean {
  if (
    input.workschedulePatternRecordId !==
    existingAssociation.workschedulePatternRecordId
  )
    return false
  if (
    input.workschedulePatternRegistryVersion !==
    existingAssociation.workschedulePatternRegistryVersion
  )
    return false
  return true
}
