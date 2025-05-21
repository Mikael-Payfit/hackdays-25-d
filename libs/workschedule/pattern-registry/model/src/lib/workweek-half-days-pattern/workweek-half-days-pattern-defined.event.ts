import { Actor } from '@payfit/common-time-model'
import {
  EdpBaseEvent,
  EdpBasePayloadEvent,
  EventProducerSchema,
} from '@payfit/edp-sdk'
import { IsDefined, IsNumber, IsUUID } from 'class-validator'
import { JSONSchema } from 'class-validator-jsonschema'
import { WorkschedulePatternRegistryPrivateEventEnum } from '../core/workschedule-pattern-registry-private-event-enum'

import { WorkweekHalfDaysPatternDefinition } from './workweek-half-days-pattern.entity'

export interface IWorkweekHalfDaysPatternRecordDefinedPayload {
  workschedulePatternRecordId: string
  workschedulePatternRegistryId: string
  name: string
  description: string
  definition: WorkweekHalfDaysPatternDefinition
  actor: Actor
}

@EventProducerSchema({
  eventType:
    WorkschedulePatternRegistryPrivateEventEnum.WORKWEEK_DAY_PATTERN_DEFINED,
  subjectType: 'workschedulePatternRegistry',
  description: ' Workweek Half Days Pattern Defined Event',
  majorVersion: 1,
  schemaName: 'workweek-half-days-pattern-defined',
})
export class WorkweekHalfDaysPatternRecordDefinedPayload extends EdpBasePayloadEvent {
  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The workschedulePatternRecordId' })
  public workschedulePatternRecordId: string

  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The workschedulePatternRegistryId' })
  public workschedulePatternRegistryId: string

  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The name' })
  public name: string

  @IsNumber()
  @IsDefined()
  @JSONSchema({ description: 'The description' })
  public description: string

  @IsDefined()
  @JSONSchema({
    description: 'The definition',
  })
  public definition: WorkweekHalfDaysPatternDefinition

  @IsDefined()
  @JSONSchema({
    description: 'The actor',
  })
  public actor: Actor

  @IsDefined()
  @JSONSchema({
    description: 'The type',
  })
  public type: 'workweek_half_day'

  constructor(payload: IWorkweekHalfDaysPatternRecordDefinedPayload) {
    super()
    this.workschedulePatternRecordId = payload.workschedulePatternRecordId
    this.workschedulePatternRegistryId = payload.workschedulePatternRegistryId
    this.name = payload.name
    this.description = payload.description
    this.definition = payload.definition
    this.actor = payload.actor
    this.type = 'workweek_half_day'
  }
}

export class WorkweekHalfDaysPatternRecordDefinedEvent extends EdpBaseEvent<WorkweekHalfDaysPatternRecordDefinedPayload> {
  constructor(
    subjectId: string,
    payload: WorkweekHalfDaysPatternRecordDefinedPayload,
  ) {
    super({
      subjectId,
      subjectType: 'workschedulePatternRegistry',
      eventDomain: 'HRIS_TIME',
      eventType:
        WorkschedulePatternRegistryPrivateEventEnum.WORKWEEK_HALF_DAYS_PATTERN_DEFINED,
      payload,
    })
  }
}
