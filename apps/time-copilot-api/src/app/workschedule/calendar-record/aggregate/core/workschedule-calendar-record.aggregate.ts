import { IEdpEvent } from '@payfit/edp-models';
import { EdpBasePayloadEvent } from '@payfit/edp-sdk';
import { IWorkscheduleCalendarRecordAggregate } from './workschedule-calendar-record-aggregate.interface';

import { generateNewEntityId } from '../../../../common/helpers/uuid';
import { Aggregate } from '../../../../common/models';
import {
  generateWorkscheduleCalendarRecord,
  GenerateWorkscheduleWorkweekCalendarRecordInput,
} from '../generate-workweek-calendar-record/generate-workschedule-workweek-calendar-record.operation';
import { regenerateWorkscheduleCalendarRecord } from '../generate-workweek-calendar-record/regenerate-workschedule-workweek-calendar-record.operation';
import { applyWorkweekCalendarRecordGenerated } from '../generate-workweek-calendar-record/workweek-calendar-record-generated.apply';
import { PrivateWorkweekCalendarRecordGeneratedEvent } from '../generate-workweek-calendar-record/workweek-calendar-record-generated.event';
import { PrivateWorkweekCalendarRecordReGeneratedEvent } from '../generate-workweek-calendar-record/workweek-calendar-record-regenerated.event';
import { WorkscheduleCalendarRecordPrivateEventEnum } from './workschedule-calendar-record-private-event-enum';
import { WorkscheduleCalendarRecord } from './workschedule-calendar-record.entity';
export class WorkscheduleCalendarRecordAggregate
  extends Aggregate<{ workscheduleCalendarRecord?: WorkscheduleCalendarRecord }>
  implements IWorkscheduleCalendarRecordAggregate
{
  private appliedEvents: IEdpEvent<EdpBasePayloadEvent>[] = [];

  private constructor({
    id,
    initialState,
  }: {
    id: string;
    initialState: { workscheduleCalendarRecord?: WorkscheduleCalendarRecord };
  }) {
    const dataStore = structuredClone(initialState);
    super(id, dataStore);
  }

  static hydrate({
    id,
    initialState,
    events,
  }: {
    id: string;
    initialState: { workscheduleCalendarRecord?: WorkscheduleCalendarRecord };
    events: IEdpEvent<EdpBasePayloadEvent>[];
  }): WorkscheduleCalendarRecordAggregate {
    const aggregate = new WorkscheduleCalendarRecordAggregate({
      id,
      initialState,
    });

    if (events.length > 0) {
      aggregate.apply(events);
      aggregate.hydrated = true;
    }

    return aggregate;
  }

  getHistory(): IEdpEvent<EdpBasePayloadEvent>[] {
    return this.appliedEvents;
  }

  static createNewWithWorkweekPatternRecord(
    newWorkscheduleCalendarRecord: GenerateWorkscheduleWorkweekCalendarRecordInput
  ): WorkscheduleCalendarRecordAggregate {
    const id = generateNewEntityId();
    const aggregate = new WorkscheduleCalendarRecordAggregate({
      id,
      initialState: {},
    });

    aggregate.generateWorkscheduleCalendarRecord(newWorkscheduleCalendarRecord);

    return aggregate;
  }

  protected apply(events: IEdpEvent<EdpBasePayloadEvent>[]): void {
    for (const event of events) {
      switch (event.eventType) {
        case WorkscheduleCalendarRecordPrivateEventEnum.PRIVATE_WORKWEEK_CALENDAR_RECORD_GENERATED:
          applyWorkweekCalendarRecordGenerated(
            this,
            event as PrivateWorkweekCalendarRecordGeneratedEvent
          );
          this.lastEventApplied = event;
          this.appliedEvents.push(event);
          break;
        case WorkscheduleCalendarRecordPrivateEventEnum.PRIVATE_WORKWEEK_CALENDAR_RECORD_REGENERATED:
          applyWorkweekCalendarRecordGenerated(
            this,
            event as PrivateWorkweekCalendarRecordReGeneratedEvent
          );
          this.lastEventApplied = event;
          this.appliedEvents.push(event);
          break;
        default:
          break;
      }
    }
  }

  protected isConsistent(): boolean {
    return this.dataStore.workscheduleCalendarRecord !== undefined;
  }

  generateWorkscheduleCalendarRecord(
    input: GenerateWorkscheduleWorkweekCalendarRecordInput
  ): void {
    return generateWorkscheduleCalendarRecord(this, input);
  }

  regenerateWorkscheduleCalendarRecord(
    input: GenerateWorkscheduleWorkweekCalendarRecordInput
  ): void {
    return regenerateWorkscheduleCalendarRecord(this, input);
  }
}
