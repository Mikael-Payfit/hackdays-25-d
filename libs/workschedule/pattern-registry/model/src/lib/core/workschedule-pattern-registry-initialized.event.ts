import {
  EdpBaseEvent,
  EdpBasePayloadEvent,
  EventProducerSchema,
} from '@payfit/edp-sdk'
import { IsDefined, IsUUID } from 'class-validator'
import { JSONSchema } from 'class-validator-jsonschema'
import { WorkschedulePatternRegistryPrivateEventEnum } from './workschedule-pattern-registry-private-event-enum'

export interface IWorkschedulePatternRegistryInitializedPayload {
  workschedulePatternRegistryId: string
}

@EventProducerSchema({
  eventType:
    WorkschedulePatternRegistryPrivateEventEnum.WORKSCHEDULE_PATTERN_REGISTRY_INITIALIZED,
  subjectType: 'workschedulePatternRegistry',
  description: ' Workweek Pattern Registry Initialized Event',
  majorVersion: 3,
  schemaName: 'workschedule-pattern-registry-initialized',
})
export class WorkschedulePatternRegistryInitializedPayload extends EdpBasePayloadEvent {
  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The workschedulePatternRegistryId' })
  public workschedulePatternRegistryId: string

  constructor(payload: IWorkschedulePatternRegistryInitializedPayload) {
    super()
    this.workschedulePatternRegistryId = payload.workschedulePatternRegistryId
  }
}

export class WorkschedulePatternRegistryInitializedEvent extends EdpBaseEvent<WorkschedulePatternRegistryInitializedPayload> {
  constructor(
    subjectId: string,
    payload: WorkschedulePatternRegistryInitializedPayload,
  ) {
    super({
      subjectId,
      subjectType: 'workschedulePatternRegistry',
      eventDomain: 'HRIS_TIME',
      eventType:
        WorkschedulePatternRegistryPrivateEventEnum.WORKSCHEDULE_PATTERN_REGISTRY_INITIALIZED,
      payload,
    })
  }
}
