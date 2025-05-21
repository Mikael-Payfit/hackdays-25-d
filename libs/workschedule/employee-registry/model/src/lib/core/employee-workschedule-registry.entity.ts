import { Entity } from '@payfit/common-time-model'
import { WorkschedulePatternAssociation } from '../associate-workschedule-pattern/workschedule-pattern-association.value-object'

export class EmployeeWorkscheduleRegistry extends Entity {
  workschedulePatternAssociations: WorkschedulePatternAssociation[] = []

  constructor(id: string) {
    super(id)
  }

  public associateWorkschedulePattern(
    workschedulePatternAssociation: WorkschedulePatternAssociation,
  ): void {
    this.workschedulePatternAssociations.push(workschedulePatternAssociation)
  }
}
