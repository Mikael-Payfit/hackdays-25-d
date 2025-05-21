import { Entity } from '@payfit/common-time-model'

export abstract class WorkschedulePatternRecord extends Entity {
  public name: string
  public description: string

  constructor(id: string, name: string, description: string) {
    super(id)
    this.name = name
    this.description = description
  }
}
