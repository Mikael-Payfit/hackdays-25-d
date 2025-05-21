import { WeekDay, Time, TimeSlot, Actor } from '@payfit/common-time-model'
import { IsString, IsDefined, IsOptional } from 'class-validator'
import { JSONSchema } from 'class-validator-jsonschema'
import { applyDecorators } from '@nestjs/common'
import { Type } from 'class-transformer'

export interface IDayLunchTime {
  day: WeekDay
  timeSlot: TimeSlot
}

export interface ITimeSlot {
  startTime: Time
  endTime: Time
  projectId?: string
  locationId?: string
}

export function IsTimeSlotPayload() {
  return applyDecorators(Type(() => TimeSlotPayload))
}

export interface ILunchTimeDefinedPayload {
  companyDigestId: string
  week: IDayLunchTime[]
  actor: Actor
}

export class TimeSlotPayload implements ITimeSlot {
  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The start date' })
  public startTime: Time

  @IsString()
  @IsDefined()
  @JSONSchema({ description: 'The end date' })
  public endTime: Time

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'The project id' })
  public projectId?: string

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'The location id' })
  public locationId?: string

  constructor(payload: ITimeSlot) {
    this.startTime = payload.startTime
    this.endTime = payload.endTime
    this.projectId = payload.projectId
    this.locationId = payload.locationId
  }
}

export class DayLunchTimePayload {
  @IsString()
  @IsDefined()
  public day: string

  @IsTimeSlotPayload()
  public timeSlot: TimeSlotPayload

  constructor(input: IDayLunchTime) {
    this.day = input.day
    this.timeSlot = input.timeSlot
  }
}
