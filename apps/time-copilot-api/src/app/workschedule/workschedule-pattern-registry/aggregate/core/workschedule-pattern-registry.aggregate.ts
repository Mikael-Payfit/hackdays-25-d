import { IEdpEvent } from '@payfit/edp-models';
import { EdpBasePayloadEvent } from '@payfit/edp-sdk';
import { generateNewEntityId } from '../../../../common/helpers/uuid';
import { Aggregate } from '../../../../common/models';
import {
  WorkweekDayPatternRecordDefinedEvent,
  WorkweekDayPatternRecordUpdatedEvent,
} from '../workweek-day-pattern';
import {
  defineNewWorkweekDayPatternRecord,
  DefineNewWorkweekDayPatternRecordInput,
  DefineNewWorkweekDayPatternRecordOutput,
} from '../workweek-day-pattern/define-new-workweek-day-pattern.operation';
import {
  updateWorkweekDayPatternRecord,
  UpdateWorkweekDayPatternRecordInput,
} from '../workweek-day-pattern/update-workweek-day-pattern.operation';
import { applyWorkweekDayPatternRecordDefined } from '../workweek-day-pattern/workweek-day-pattern-defined.apply';
import { applyWorkweekDayPatternRecordUpdated } from '../workweek-day-pattern/workweek-day-pattern-updated.apply';
import {
  defineNewWorkweekHalfDaysPatternRecord,
  DefineNewWorkweekHalfDaysPatternRecordInput,
  DefineNewWorkweekHalfDaysPatternRecordOutput,
} from '../workweek-half-days-pattern/define-new-workweek-half-days-pattern.operation';
import {
  updateWorkweekHalfDaysPatternRecord,
  UpdateWorkweekHalfDaysPatternRecordInput,
} from '../workweek-half-days-pattern/update-workweek-half-days-pattern.operation';
import { applyWorkweekHalfDaysPatternRecordDefined } from '../workweek-half-days-pattern/workweek-half-days-pattern-defined.apply';
import { WorkweekHalfDaysPatternRecordDefinedEvent } from '../workweek-half-days-pattern/workweek-half-days-pattern-defined.event';
import { applyWorkweekHalfDaysPatternRecordUpdated } from '../workweek-half-days-pattern/workweek-half-days-pattern-updated.apply';
import { WorkweekHalfDaysPatternRecordUpdatedEvent } from '../workweek-half-days-pattern/workweek-half-days-pattern-updated.event';
import { WorkweekPatternRecordDefinedEvent } from '../workweek-pattern';
import {
  defineNewWorkweekTimeSlotsPatternRecord,
  DefineNewWorkweekTimeSlotsPatternRecordInput,
  DefineNewWorkweekTimeSlotsPatternRecordOutput,
} from '../workweek-pattern/define-new-workweek-time-slots-pattern.operation';
import {
  updateWorkweekPatternRecord,
  UpdateWorkweekPatternRecordInput,
} from '../workweek-pattern/update-workweek-pattern.operation';
import { applyWorkweekPatternRecordDefined } from '../workweek-pattern/workweek-pattern-defined.apply';
import { applyWorkweekPatternRecordUpdated } from '../workweek-pattern/workweek-pattern-updated.apply';
import { WorkweekPatternRecordUpdatedEvent } from '../workweek-pattern/workweek-pattern-updated.event';
import {
  WorkschedulePatternRegistryInitializedEvent,
  WorkschedulePatternRegistryInitializedPayload,
} from './workschedule-pattern-registry-initialized.event';
import { WorkschedulePatternRegistryPrivateEventEnum } from './workschedule-pattern-registry-private-event-enum';
import { WorkschedulePatternRecord } from './workschedule-pattern.entity';

export class WorkschedulePatternRegistryAggregate extends Aggregate<
  WorkschedulePatternRecord[] // TODO: use an object instead of an array
> {
  private appliedEvents: IEdpEvent<EdpBasePayloadEvent>[] = [];

  private constructor({
    id,
    initialState,
  }: {
    id: string;
    initialState: WorkschedulePatternRecord[];
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
    initialState: WorkschedulePatternRecord[];
    events: IEdpEvent<EdpBasePayloadEvent>[];
  }): WorkschedulePatternRegistryAggregate {
    const aggregate = new WorkschedulePatternRegistryAggregate({
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

  static createNew(): WorkschedulePatternRegistryAggregate {
    const aggregate = new WorkschedulePatternRegistryAggregate({
      id: generateNewEntityId(),
      initialState: [],
    });

    aggregate.applyBeforePersist([
      new WorkschedulePatternRegistryInitializedEvent(
        aggregate.id,
        new WorkschedulePatternRegistryInitializedPayload({
          workschedulePatternRegistryId: aggregate.id,
        })
      ),
    ]);

    return aggregate;
  }

  protected apply(events: IEdpEvent<EdpBasePayloadEvent>[]): void {
    for (const event of events) {
      switch (event.eventType) {
        // Workweek Pattern
        case WorkschedulePatternRegistryPrivateEventEnum.WORKWEEK_PATTERN_DEFINED: {
          applyWorkweekPatternRecordDefined(
            this,
            event as WorkweekPatternRecordDefinedEvent
          );
          this.lastEventApplied = event;
          this.appliedEvents.push(event);
          break;
        }
        case WorkschedulePatternRegistryPrivateEventEnum.WORKWEEK_PATTERN_UPDATED: {
          applyWorkweekPatternRecordUpdated(
            this,
            event as WorkweekPatternRecordUpdatedEvent
          );
          this.lastEventApplied = event;
          this.appliedEvents.push(event);
          break;
        }
        // Workweek Day Pattern
        case WorkschedulePatternRegistryPrivateEventEnum.WORKWEEK_DAY_PATTERN_DEFINED: {
          applyWorkweekDayPatternRecordDefined(
            this,
            event as WorkweekDayPatternRecordDefinedEvent
          );
          this.lastEventApplied = event;
          this.appliedEvents.push(event);
          break;
        }
        case WorkschedulePatternRegistryPrivateEventEnum.WORKWEEK_DAY_PATTERN_UPDATED: {
          applyWorkweekDayPatternRecordUpdated(
            this,
            event as WorkweekDayPatternRecordUpdatedEvent
          );
          this.lastEventApplied = event;
          this.appliedEvents.push(event);
          break;
        }
        // Workweek Half Days Pattern
        case WorkschedulePatternRegistryPrivateEventEnum.WORKWEEK_HALF_DAYS_PATTERN_DEFINED: {
          applyWorkweekHalfDaysPatternRecordDefined(
            this,
            event as WorkweekHalfDaysPatternRecordDefinedEvent
          );
          this.lastEventApplied = event;
          this.appliedEvents.push(event);
          break;
        }
        case WorkschedulePatternRegistryPrivateEventEnum.WORKWEEK_HALF_DAYS_PATTERN_UPDATED: {
          applyWorkweekHalfDaysPatternRecordUpdated(
            this,
            event as WorkweekHalfDaysPatternRecordUpdatedEvent
          );
          this.lastEventApplied = event;
          this.appliedEvents.push(event);
          break;
        }

        default:
          break;
      }
    }
  }

  protected isConsistent(): boolean {
    return true;
  }

  public getPatternById(id: string): WorkschedulePatternRecord | undefined {
    return this.dataStore.find((pattern) => pattern.id === id);
  }

  public defineNewWorkweekTimeSlotsPatternRecord(
    input: DefineNewWorkweekTimeSlotsPatternRecordInput
  ): DefineNewWorkweekTimeSlotsPatternRecordOutput {
    return defineNewWorkweekTimeSlotsPatternRecord(this, input);
  }

  public defineNewWorkweekHalfDaysPatternRecord(
    input: DefineNewWorkweekHalfDaysPatternRecordInput
  ): DefineNewWorkweekHalfDaysPatternRecordOutput {
    return defineNewWorkweekHalfDaysPatternRecord(this, input);
  }

  public defineNewWorkweekDayPatternRecord(
    input: DefineNewWorkweekDayPatternRecordInput
  ): DefineNewWorkweekDayPatternRecordOutput {
    return defineNewWorkweekDayPatternRecord(this, input);
  }

  public updateWorkweekPatternRecord(
    input: UpdateWorkweekPatternRecordInput
  ): void {
    return updateWorkweekPatternRecord(this, input);
  }

  public updateWorkweekHalfDaysPatternRecord(
    input: UpdateWorkweekHalfDaysPatternRecordInput
  ): void {
    return updateWorkweekHalfDaysPatternRecord(this, input);
  }

  public updateWorkweekDayPatternRecord(
    input: UpdateWorkweekDayPatternRecordInput
  ): void {
    return updateWorkweekDayPatternRecord(this, input);
  }
}
