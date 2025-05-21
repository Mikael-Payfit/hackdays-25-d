import {
  EdpBaseEvent,
  EdpBasePayloadEvent,
  EventProducerSchema,
} from '@payfit/edp-sdk'
import { IsDefined, IsString, IsUUID } from 'class-validator'
import { JSONSchema } from 'class-validator-jsonschema'
import { WorkscheduleCalendarRecordPrivateEventEnum } from './workschedule-calendar-record-private-event-enum'

export interface IWorkscheduleCalendarRecordInitializedPayload {
  employeeWorkscheduleRegistryIdWithPeriodPartitionKey: string
  workscheduleCalendarRecordId: string
}

@EventProducerSchema({
  eventType:
    WorkscheduleCalendarRecordPrivateEventEnum.PRIVATE_WORKSCHEDULE_CALENDAR_RECORD_INITIALIZED,
  subjectType: 'workscheduleCalendarRecord',
  description: 'Workschedule Calendar Record Initialized Event',
  majorVersion: 2,
  schemaName: 'workschedule-calendar-record-initialized',
})
export class WorkscheduleCalendarRecordInitializedPayload extends EdpBasePayloadEvent {
  @IsString()
  @IsDefined()
  @JSONSchema({
    description:
      'The employeeWorkscheduleRegistryIdWithPeriodPartitionKey, to fetch by date',
  })
  public employeeWorkscheduleRegistryIdWithPeriodPartitionKey: string

  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The workscheduleCalendarRecordId' })
  public workscheduleCalendarRecordId: string

  constructor(payload: IWorkscheduleCalendarRecordInitializedPayload) {
    super()
    this.employeeWorkscheduleRegistryIdWithPeriodPartitionKey =
      payload.employeeWorkscheduleRegistryIdWithPeriodPartitionKey
    this.workscheduleCalendarRecordId = payload.workscheduleCalendarRecordId
  }
}

export class WorkscheduleCalendarRecordInitializedEvent extends EdpBaseEvent<WorkscheduleCalendarRecordInitializedPayload> {
  constructor(
    subjectId: string,
    eventEffectiveTime: number,
    payload: WorkscheduleCalendarRecordInitializedPayload,
  ) {
    super({
      subjectId,
      subjectType: 'workscheduleCalendarRecord',
      eventDomain: 'HRIS_TIME',
      eventEffectiveTime,
      eventType:
        WorkscheduleCalendarRecordPrivateEventEnum.PRIVATE_WORKSCHEDULE_CALENDAR_RECORD_INITIALIZED,
      payload,
    })
  }
}
