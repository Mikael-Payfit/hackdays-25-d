import { Entity } from '../../../../common/models';

export abstract class WorkschedulePatternRecord extends Entity {
  public name: string;
  public description: string;

  constructor(id: string, name: string, description: string) {
    super(id);
    this.name = name;
    this.description = description;
  }
}
