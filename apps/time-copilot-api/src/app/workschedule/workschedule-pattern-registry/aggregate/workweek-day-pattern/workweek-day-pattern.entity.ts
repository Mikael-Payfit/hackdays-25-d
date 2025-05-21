import { isEqual } from 'lodash';
import { WeekDay } from '../../../../common/models';
import { WorkschedulePatternRecord } from '../core/workschedule-pattern.entity';

export type WeekDayBasicDefinition = {
  isJourOuvre: boolean;
  isJourOuvrable: boolean;
  planned: boolean;
};

export type WorkweekDayPatternDefinition = Record<
  WeekDay,
  WeekDayBasicDefinition
>;

export interface IWorkweekDayPatternRecord {
  id: string;
  name: string;
  description: string;
  definition: WorkweekDayPatternDefinition;
}

export class WorkweekDayPatternRecord
  extends WorkschedulePatternRecord
  implements IWorkweekDayPatternRecord
{
  public definition: WorkweekDayPatternDefinition;

  constructor({
    id,
    name,
    description,
    definition,
  }: {
    id: string;
    name: string;
    description: string;
    definition: WorkweekDayPatternDefinition;
  }) {
    super(id, name, description);
    this.definition = definition;
  }

  public equals(workweekDayPattern: {
    name: string;
    description: string;
    definition: WorkweekDayPatternDefinition;
  }): boolean {
    return (
      this.name === workweekDayPattern.name &&
      this.description === workweekDayPattern.description &&
      isEqual(this.definition, workweekDayPattern.definition)
    );
  }
}
