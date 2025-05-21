import { ISOFormatDate } from '@payfit/common-time-model'
import {
  EdpBaseEvent,
  EdpBasePayloadEvent,
  EdpSchemaChildType,
  EventProducerSchema,
} from '@payfit/edp-sdk'
import {
  IsArray,
  IsDefined,
  IsNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator'
import { JSONSchema } from 'class-validator-jsonschema'
import {
  IPlannedWeekDayDefinition,
  PlannedWeekDayDefinitionPayload,
} from './models/workweek-definition'
import { WorkscheduleCalendarRecordPublicEventEnum } from './workschedule-calendar-record-public-event-enum'

export interface IWorkweekCalendarRecordReGeneratedPayload {
  country: string
  jlCompanyId: string
  jlContractId: string
  workscheduleCalendarRecordId: string
  employeeWorkscheduleRegistryId: string
  employeeWorkscheduleRegistryVersion: number
  workschedulePatternRecordId: string
  startDate: ISOFormatDate
  endDate: ISOFormatDate
  plannedWeek: IPlannedWeekDayDefinition[]
}

@EventProducerSchema({
  eventType:
    WorkscheduleCalendarRecordPublicEventEnum.WORKWEEK_CALENDAR_RECORD_REGENERATED,
  subjectType: 'jlContractId',
  description: 'Workweek Calendar Record Re Generated Event',
  majorVersion: 6,
  schemaName: 'workweek-calendar-record-regenerated',
})
export class WorkweekCalendarRecordReGeneratedPayload
  extends EdpBasePayloadEvent
  implements IWorkweekCalendarRecordReGeneratedPayload
{
  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The country' })
  public country: string

  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The company id used by JetLang' })
  public jlCompanyId: string

  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The contract id used by JetLang' })
  public jlContractId: string

  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The workschedule calendar record id' })
  public workscheduleCalendarRecordId: string

  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The employee workschedule registry id' })
  public employeeWorkscheduleRegistryId: string

  @IsNumber()
  @IsDefined()
  @JSONSchema({ description: 'The employee workschedule registry version' })
  public employeeWorkscheduleRegistryVersion: number

  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The workschedule pattern record id' })
  public workschedulePatternRecordId: string

  @IsDefined()
  @IsString()
  @JSONSchema({ description: 'The start date' })
  public startDate: ISOFormatDate

  @IsDefined()
  @IsString()
  @JSONSchema({ description: 'The end date' })
  public endDate: ISOFormatDate

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @EdpSchemaChildType(PlannedWeekDayDefinitionPayload)
  @JSONSchema({ description: 'The planned week' })
  public plannedWeek: PlannedWeekDayDefinitionPayload[]

  constructor(payload: IWorkweekCalendarRecordReGeneratedPayload) {
    super()
    this.country = payload.country
    this.jlCompanyId = payload.jlCompanyId
    this.jlContractId = payload.jlContractId
    this.workscheduleCalendarRecordId = payload.workscheduleCalendarRecordId
    this.employeeWorkscheduleRegistryId = payload.employeeWorkscheduleRegistryId
    this.employeeWorkscheduleRegistryVersion =
      payload.employeeWorkscheduleRegistryVersion
    this.workschedulePatternRecordId = payload.workschedulePatternRecordId
    this.startDate = payload.startDate
    this.endDate = payload.endDate
    this.plannedWeek = payload.plannedWeek.map(
      (week) => new PlannedWeekDayDefinitionPayload(week),
    )
  }
}

export class WorkweekCalendarRecordReGeneratedEvent extends EdpBaseEvent<IWorkweekCalendarRecordReGeneratedPayload> {
  constructor(
    subjectId: string,
    eventEffectiveTime: number,
    payload: IWorkweekCalendarRecordReGeneratedPayload,
  ) {
    super({
      subjectId,
      subjectType: 'jlContractId',
      eventDomain: 'HRIS_TIME',
      eventEffectiveTime,
      eventType:
        WorkscheduleCalendarRecordPublicEventEnum.WORKWEEK_CALENDAR_RECORD_REGENERATED,
      payload,
    })
  }
}
