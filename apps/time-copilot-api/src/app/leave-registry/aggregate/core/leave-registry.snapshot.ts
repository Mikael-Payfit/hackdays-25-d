import { EdpBasePayloadEvent, IEdpEvent } from '@payfit/edp-sdk'
import { ILeaveRegistry, LeaveRegistry } from './value-objects'

export class LeaveRegistrySnapshot {
  private initialState: ILeaveRegistry | undefined
  private appliedEvents: IEdpEvent<EdpBasePayloadEvent>[] = []
  private cursor: IEdpEvent<EdpBasePayloadEvent> | undefined = undefined
  private dataStore: LeaveRegistry | undefined

  constructor(
    public readonly leaveRegistryId: string,
    initialState?: ILeaveRegistry,
  ) {
    this.initialState = initialState
      ? { ...initialState }
      : {
          id: leaveRegistryId,
          leaveRecords: [],
          submissions: [],
          associatedExternalIds: [],
        }

    this.dataStore = LeaveRegistry.fromJSON({
      ...this.initialState,
      leaveRecords: [...this.initialState.leaveRecords],
      submissions: [...this.initialState.submissions],
      associatedExternalIds: [...this.initialState.associatedExternalIds],
    })
  }

  setCursor(cursor: IEdpEvent<EdpBasePayloadEvent>): void {
    this.cursor = cursor
  }

  getCursor(): IEdpEvent<EdpBasePayloadEvent> | undefined {
    return this.cursor
  }

  getDataStore(): LeaveRegistry {
    if (!this.dataStore) {
      throw new Error('Data store is not initialized')
    }
    return this.dataStore
  }

  getInitialState(): ILeaveRegistry {
    if (!this.initialState) {
      throw new Error('Initial state is not initialized')
    }
    return this.initialState
  }

  getAppliedEvents(): IEdpEvent<EdpBasePayloadEvent>[] {
    return this.appliedEvents
  }

  addAppliedEvent(event: IEdpEvent<EdpBasePayloadEvent>): void {
    this.appliedEvents.push(event)
    this.setCursor(event)
  }
}
