import { IEdpEvent } from '@payfit/edp-models';
import { EdpBasePayloadEvent } from '@payfit/edp-sdk';
import { isArray } from 'class-validator';
import { AggregateConsistencyError } from '../errors/aggregate-consistency.error';

export abstract class Aggregate<T> {
  private _id: string;
  private _dataStore: T;
  protected lastEventApplied: IEdpEvent<EdpBasePayloadEvent> | undefined =
    undefined;
  private _eventsToPersist: IEdpEvent<EdpBasePayloadEvent>[] = [];
  private _consistencyErrors: string[] = [];
  private _hydrated = false;

  constructor(id: string, dataStore: T) {
    this._id = id;
    this._dataStore = dataStore;
  }

  public get version(): number {
    return this.lastEventApplied ? this.lastEventApplied.eventTime : 0;
  }

  public get id(): string {
    return this._id;
  }

  public get dataStore(): T {
    return this._dataStore;
  }

  public get eventsToPersist(): IEdpEvent<EdpBasePayloadEvent>[] {
    return this._eventsToPersist;
  }

  public get consistencyErrors(): string[] {
    return this._consistencyErrors;
  }

  public get hydrated(): boolean {
    return this._hydrated;
  }

  protected set hydrated(val: boolean) {
    this._hydrated = val;
  }

  protected abstract isConsistent(): boolean;
  protected abstract apply(events: IEdpEvent<EdpBasePayloadEvent>[]): void;

  public applyBeforePersist(events: IEdpEvent<EdpBasePayloadEvent>[]) {
    this._eventsToPersist.push(...events);

    this.apply(events);

    if (!this.isConsistent()) {
      throw new AggregateConsistencyError(events, this._consistencyErrors);
    }
  }

  public clearEventsToPersist(
    edpResult: IEdpEvent<EdpBasePayloadEvent> | IEdpEvent<EdpBasePayloadEvent>[]
  ): void {
    this._eventsToPersist = [];

    // Update times (and aggregate versions) from edp server
    if (isArray(edpResult)) {
      this.lastEventApplied = this.getLatestByEventTime(edpResult);
    } else {
      this.lastEventApplied = edpResult;
    }
  }

  private getLatestByEventTime(
    events: IEdpEvent<EdpBasePayloadEvent>[]
  ): IEdpEvent<EdpBasePayloadEvent> | undefined {
    if (events.length === 0) {
      return undefined;
    }

    return events.reduce((latest, current) =>
      current.eventTime > latest.eventTime ? current : latest
    );
  }
}
