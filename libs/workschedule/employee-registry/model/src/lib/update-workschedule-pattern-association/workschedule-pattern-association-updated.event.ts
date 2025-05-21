import { Actor, DatePeriodWithoutEnd } from '@payfit/common-time-model'
import {
  EdpBaseEvent,
  EdpBasePayloadEvent,
  EventProducerSchema,
} from '@payfit/edp-sdk'
import { IsDefined, IsNumber, IsOptional, IsUUID } from 'class-validator'
import { JSONSchema } from 'class-validator-jsonschema'
import { EmployeeWorkscheduleRegistryPrivateEventEnum } from '../core/employee-workschedule-registry-private-event-enum'

export interface IWorkschedulePatternAssociationUpdatedPayload {
  employeeWorkscheduleRegistryId: string
  workschedulePatternRegistryId: string
  workschedulePatternRegistryVersion: number
  workschedulePatternRecordId: string
  validityPeriod: DatePeriodWithoutEnd
  actor: Actor
}

@EventProducerSchema({
  eventType:
    EmployeeWorkscheduleRegistryPrivateEventEnum.WORKSCHEDULE_PATTERN_ASSOCIATION_UPDATED,
  subjectType: 'employeeWorkscheduleRegistry',
  description: ' Workweek Pattern Associated To Employee Registry Event',
  majorVersion: 6,
  schemaName: 'workweek-pattern-association-updated',
})
export class WorkschedulePatternAssociationUpdatedPayload extends EdpBasePayloadEvent {
  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The employeeWorkscheduleRegistryId' })
  public employeeWorkscheduleRegistryId: string

  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The workschedulePatternRegistryId' })
  public workschedulePatternRegistryId: string

  @IsNumber()
  @IsDefined()
  @JSONSchema({ description: 'The workschedulePatternRegistryVersion' })
  public workschedulePatternRegistryVersion: number

  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The workschedulePatternRecordId' })
  public workschedulePatternRecordId: string

  @IsOptional()
  @JSONSchema({
    description: 'The validity period',
  })
  public validityPeriod: DatePeriodWithoutEnd

  @IsDefined()
  @JSONSchema({
    description: 'The actor',
  })
  public actor: Actor

  constructor(payload: IWorkschedulePatternAssociationUpdatedPayload) {
    super()
    this.employeeWorkscheduleRegistryId = payload.employeeWorkscheduleRegistryId
    this.workschedulePatternRegistryId = payload.workschedulePatternRegistryId
    this.workschedulePatternRegistryVersion =
      payload.workschedulePatternRegistryVersion
    this.workschedulePatternRecordId = payload.workschedulePatternRecordId
    this.validityPeriod = payload.validityPeriod

    this.actor = payload.actor
  }
}

export class WorkschedulePatternAssociationUpdatedEvent extends EdpBaseEvent<WorkschedulePatternAssociationUpdatedPayload> {
  constructor(
    subjectId: string,
    payload: WorkschedulePatternAssociationUpdatedPayload,
  ) {
    super({
      subjectId,
      subjectType: 'employeeWorkscheduleRegistry',
      eventDomain: 'HRIS_TIME',
      eventType:
        EmployeeWorkscheduleRegistryPrivateEventEnum.WORKSCHEDULE_PATTERN_ASSOCIATION_UPDATED,
      payload,
    })
  }
}
