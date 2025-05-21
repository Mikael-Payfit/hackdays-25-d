import { applyDecorators } from '@nestjs/common';
import { EdpSchemaChildType } from '@payfit/edp-models';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { ISOFormatDate, Time, WeekDay } from '../../../../../common/models';

export interface IPlannedWeekDayDefinition {
  date: ISOFormatDate;
  day: WeekDay;
  lunchBreakTimeSlot: ITimeSlot;
  isPublicHoliday: boolean;
  isJourOuvrable?: boolean;
  isJourOuvre?: boolean;
  timeslots: ITimeSlot[];
}

export interface ITimeSlot {
  startTime: Time;
  endTime: Time;
  projectId?: string;
  locationId?: string;
}

export function IsTimeSlotPayload() {
  return applyDecorators(Type(() => TimeSlotPayload));
}

export class TimeSlotPayload implements ITimeSlot {
  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The start date' })
  public startTime: Time;

  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The end date' })
  public endTime: Time;

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'The project id' })
  public projectId?: string;

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'The location id' })
  public locationId?: string;

  constructor(payload: ITimeSlot) {
    this.startTime = payload.startTime;
    this.endTime = payload.endTime;
    this.projectId = payload.projectId;
    this.locationId = payload.locationId;
  }
}

export class PlannedWeekDayDefinitionPayload
  implements IPlannedWeekDayDefinition
{
  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The ISO date' })
  public date: ISOFormatDate;

  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The day' })
  public day: WeekDay;

  @IsTimeSlotPayload()
  @JSONSchema({ description: 'The lunchbreak time' })
  public lunchBreakTimeSlot: TimeSlotPayload;

  @IsBoolean()
  @IsDefined()
  @JSONSchema({ description: 'The country' })
  public isPublicHoliday: boolean;

  @IsBoolean()
  @IsOptional()
  @JSONSchema({ description: 'Indicates if the day is "ouvrable" in France' })
  public isJourOuvrable?: boolean;

  @IsBoolean()
  @IsOptional()
  @JSONSchema({ description: 'Indicates if the day is "ouvre" in France' })
  public isJourOuvre?: boolean;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @EdpSchemaChildType(TimeSlotPayload)
  @JSONSchema({ description: 'The timeslots' })
  public timeslots: TimeSlotPayload[];

  constructor(payload: IPlannedWeekDayDefinition) {
    this.date = payload.date;
    this.day = payload.day;
    this.lunchBreakTimeSlot = payload.lunchBreakTimeSlot;
    this.isPublicHoliday = payload.isPublicHoliday;
    this.isJourOuvrable = payload.isJourOuvrable;
    this.isJourOuvre = payload.isJourOuvre;
    this.timeslots = payload.timeslots.map(
      (timeslot) => new TimeSlotPayload(timeslot)
    );
  }
}
