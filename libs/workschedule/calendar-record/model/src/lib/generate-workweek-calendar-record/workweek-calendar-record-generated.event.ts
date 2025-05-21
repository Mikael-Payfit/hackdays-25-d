import { Actor, ISOFormatDate } from '@payfit/common-time-model'
import {
  EdpBaseEvent,
  EdpBasePayloadEvent,
  EdpSchemaChildType,
  EventProducerSchema,
} from '@payfit/edp-sdk'
import { WorkweekPatternRecord } from '@payfit/workschedule/pattern-registry-model'
import {
  IsArray,
  IsDefined,
  IsNumber,
  IsObject,
  IsString,
  IsUUID,
} from 'class-validator'
import { JSONSchema } from 'class-validator-jsonschema'
import { PlannedWeekDay } from '../core/calendar-record.value-objects'
import { WorkscheduleCalendarRecordPrivateEventEnum } from '../core/workschedule-calendar-record-private-event-enum'
import { PlannedWeekDayDefinitionPayload } from './workweek-definition'

export interface IPrivateWorkweekCalendarRecordGeneratedPayload {
  employeeWorkscheduleRegistryIdWithPeriodPartitionKey: string
  country: string
  workscheduleCalendarRecordId: string
  employeeWorkscheduleRegistryId: string
  employeeWorkscheduleRegistryVersion: number
  workschedulePatternRecordId: string
  startDate: ISOFormatDate
  endDate: ISOFormatDate
  workweekPatternRecord: WorkweekPatternRecord
  plannedWeek: PlannedWeekDay[]
  actor: Actor
}

@EventProducerSchema({
  eventType:
    WorkscheduleCalendarRecordPrivateEventEnum.PRIVATE_WORKWEEK_CALENDAR_RECORD_GENERATED,
  subjectType: 'workscheduleCalendarRecord',
  description: 'Workweek Calendar Record Generated Event',
  majorVersion: 6,
  schemaName: 'private-workweek-calendar-record-generated',
})
export class PrivateWorkweekCalendarRecordGeneratedPayload extends EdpBasePayloadEvent {
  @IsString()
  @IsDefined()
  @JSONSchema({
    description:
      'The employeeWorkscheduleRegistryIdWithPeriodPartitionKey, to fetch by date',
  })
  public employeeWorkscheduleRegistryIdWithPeriodPartitionKey: string

  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The country' })
  public country: string

  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The workscheduleCalendarRecordId' })
  public workscheduleCalendarRecordId: string

  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The employeeWorkscheduleRegistryId' })
  public employeeWorkscheduleRegistryId: string

  @IsNumber()
  @IsDefined()
  @JSONSchema({ description: 'The employeeWorkscheduleRegistryVersion' })
  public employeeWorkscheduleRegistryVersion: number

  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The workschedulePatternRecordId' })
  public workschedulePatternRecordId: string

  @IsDefined()
  @IsString()
  @JSONSchema({ description: 'The startDate' })
  public startDate: ISOFormatDate

  @IsDefined()
  @IsString()
  @JSONSchema({ description: 'The endDate' })
  public endDate: ISOFormatDate

  @IsObject()
  @IsDefined()
  @JSONSchema({ description: 'The workweek Pattern record' })
  public workweekPatternRecord: WorkweekPatternRecord

  @IsArray()
  @IsDefined()
  @EdpSchemaChildType(PlannedWeekDayDefinitionPayload)
  @JSONSchema({ description: 'The planned week' })
  public plannedWeek: PlannedWeekDayDefinitionPayload[]

  @IsObject()
  @IsDefined()
  @JSONSchema({ description: 'The actor' })
  public actor: Actor

  constructor(payload: IPrivateWorkweekCalendarRecordGeneratedPayload) {
    super()
    this.employeeWorkscheduleRegistryIdWithPeriodPartitionKey =
      payload.employeeWorkscheduleRegistryIdWithPeriodPartitionKey
    this.country = payload.country
    this.workscheduleCalendarRecordId = payload.workscheduleCalendarRecordId
    this.employeeWorkscheduleRegistryId = payload.employeeWorkscheduleRegistryId
    this.employeeWorkscheduleRegistryVersion =
      payload.employeeWorkscheduleRegistryVersion
    this.workschedulePatternRecordId = payload.workschedulePatternRecordId
    this.startDate = payload.startDate
    this.endDate = payload.endDate
    this.workweekPatternRecord = payload.workweekPatternRecord
    this.plannedWeek = payload.plannedWeek.map(
      (week) => new PlannedWeekDayDefinitionPayload(week),
    )
    this.actor = payload.actor
  }
}

export class PrivateWorkweekCalendarRecordGeneratedEvent extends EdpBaseEvent<IPrivateWorkweekCalendarRecordGeneratedPayload> {
  constructor(
    subjectId: string,
    eventEffectiveTime: number,
    payload: PrivateWorkweekCalendarRecordGeneratedPayload,
  ) {
    super({
      subjectId,
      subjectType: 'workscheduleCalendarRecord',
      eventDomain: 'HRIS_TIME',
      eventEffectiveTime,
      eventType:
        WorkscheduleCalendarRecordPrivateEventEnum.PRIVATE_WORKWEEK_CALENDAR_RECORD_GENERATED,
      payload,
    })
  }
}
