import {
  EdpBaseEvent,
  EdpBasePayloadEvent,
  EdpSchemaChildType,
  EventProducerSchema,
} from '@payfit/edp-sdk';
import {
  IsArray,
  IsDefined,
  IsNumber,
  IsObject,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { Actor, ISOFormatDate } from '../../../common/models';
import { WorkweekPatternRecord } from '../../workschedule-pattern-registry/aggregate/workweek-pattern';
import { PlannedWeekDay } from '../core/calendar-record.value-objects';
import { WorkscheduleCalendarRecordPrivateEventEnum } from '../core/workschedule-calendar-record-private-event-enum';
import { PlannedWeekDayDefinitionPayload } from './workweek-definition';

export interface IPrivateWorkweekCalendarRecordReGeneratedPayload {
  employeeWorkscheduleRegistryIdWithPeriodPartitionKey: string;
  country: string;
  workscheduleCalendarRecordId: string;
  employeeWorkscheduleRegistryId: string;
  employeeWorkscheduleRegistryVersion: number;
  workschedulePatternRecordId: string;
  startDate: ISOFormatDate;
  endDate: ISOFormatDate;
  workweekPatternRecord: WorkweekPatternRecord;
  plannedWeek: PlannedWeekDay[];
  actor: Actor;
}

@EventProducerSchema({
  eventType:
    WorkscheduleCalendarRecordPrivateEventEnum.PRIVATE_WORKWEEK_CALENDAR_RECORD_REGENERATED,
  subjectType: 'workscheduleCalendarRecord',
  description: 'Workweek Calendar Record ReGenerated Event',
  majorVersion: 6,
  schemaName: 'private-workweek-calendar-record-regenerated',
})
export class PrivateWorkweekCalendarRecordReGeneratedPayload extends EdpBasePayloadEvent {
  @IsString()
  @IsDefined()
  @JSONSchema({
    description:
      'The employeeWorkscheduleRegistryIdWithPeriodPartitionKey, to fetch by date',
  })
  public employeeWorkscheduleRegistryIdWithPeriodPartitionKey: string;

  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The country' })
  public country: string;

  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The workscheduleCalendarRecordId' })
  public workscheduleCalendarRecordId: string;

  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The employeeWorkscheduleRegistryId' })
  public employeeWorkscheduleRegistryId: string;

  @IsNumber()
  @IsDefined()
  @JSONSchema({ description: 'The employeeWorkscheduleRegistryVersion' })
  public employeeWorkscheduleRegistryVersion: number;

  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The workschedulePatternRecordId' })
  public workschedulePatternRecordId: string;

  @IsDefined()
  @IsString()
  @JSONSchema({ description: 'The startDate' })
  public startDate: ISOFormatDate;

  @IsDefined()
  @IsString()
  @JSONSchema({ description: 'The endDate' })
  public endDate: ISOFormatDate;

  @IsObject()
  @IsDefined()
  @JSONSchema({ description: 'The workweek Pattern record' })
  public workweekPatternRecord: WorkweekPatternRecord;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @EdpSchemaChildType(PlannedWeekDayDefinitionPayload)
  @JSONSchema({ description: 'The planned week' })
  public plannedWeek: PlannedWeekDayDefinitionPayload[];

  @IsObject()
  @IsDefined()
  @JSONSchema({ description: 'The actor' })
  public actor: Actor;

  constructor(payload: IPrivateWorkweekCalendarRecordReGeneratedPayload) {
    super();
    this.employeeWorkscheduleRegistryIdWithPeriodPartitionKey =
      payload.employeeWorkscheduleRegistryIdWithPeriodPartitionKey;
    this.country = payload.country;
    this.workscheduleCalendarRecordId = payload.workscheduleCalendarRecordId;
    this.employeeWorkscheduleRegistryId =
      payload.employeeWorkscheduleRegistryId;
    this.employeeWorkscheduleRegistryVersion =
      payload.employeeWorkscheduleRegistryVersion;
    this.workschedulePatternRecordId = payload.workschedulePatternRecordId;
    this.startDate = payload.startDate;
    this.endDate = payload.endDate;
    this.workweekPatternRecord = payload.workweekPatternRecord;
    this.plannedWeek = payload.plannedWeek.map(
      (week) => new PlannedWeekDayDefinitionPayload(week)
    );
    this.actor = payload.actor;
  }
}

export class PrivateWorkweekCalendarRecordReGeneratedEvent extends EdpBaseEvent<PrivateWorkweekCalendarRecordReGeneratedPayload> {
  constructor(
    subjectId: string,
    eventEffectiveTime: number,
    payload: PrivateWorkweekCalendarRecordReGeneratedPayload
  ) {
    super({
      subjectId,
      subjectType: 'workscheduleCalendarRecord',
      eventDomain: 'HRIS_TIME',
      eventEffectiveTime,
      eventType:
        WorkscheduleCalendarRecordPrivateEventEnum.PRIVATE_WORKWEEK_CALENDAR_RECORD_REGENERATED,
      payload,
    });
  }
}
