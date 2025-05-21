import { Actor, DatePeriodWithoutEnd } from '@payfit/common-time-model'
import {
  EdpBaseEvent,
  EdpBasePayloadEvent,
  EventProducerSchema,
} from '@payfit/edp-sdk'
import { IsDefined, IsNumber, IsObject, IsUUID } from 'class-validator'
import { JSONSchema } from 'class-validator-jsonschema'
import { EmployeeWorkscheduleRegistryPrivateEventEnum } from '../core/employee-workschedule-registry-private-event-enum'

export interface IWorkschedulePatternRecordAssociatedToEmployeeWorkscheduleRegistryPayload {
  employeeWorkscheduleRegistryId: string
  workschedulePatternRegistryId: string
  workschedulePatternRegistryVersion: number
  workschedulePatternRecordId: string
  validityPeriod: DatePeriodWithoutEnd
  actor: Actor
}

@EventProducerSchema({
  eventType:
    EmployeeWorkscheduleRegistryPrivateEventEnum.WORKSCHEDULE_PATTERN_ASSOCIATED_TO_EMPLOYEE_WORKSCHEDULE_REGISTRY,
  subjectType: 'employeeWorkscheduleRegistry',
  description: ' Workweek Pattern Associated To Employee Registry Event',
  majorVersion: 4,
  schemaName: 'workweek-pattern-associated-to-employee-registry',
})
export class WorkschedulePatternRecordAssociatedToEmployeeWorkscheduleRegistryPayload extends EdpBasePayloadEvent {
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

  @IsObject()
  @IsDefined()
  @JSONSchema({ description: 'The validityPeriod' })
  public validityPeriod: DatePeriodWithoutEnd

  @IsDefined()
  @JSONSchema({
    description: 'The actor',
  })
  public actor: Actor

  constructor(
    payload: IWorkschedulePatternRecordAssociatedToEmployeeWorkscheduleRegistryPayload,
  ) {
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

export class WorkschedulePatternRecordAssociatedToEmployeeWorkscheduleRegistryEvent extends EdpBaseEvent<WorkschedulePatternRecordAssociatedToEmployeeWorkscheduleRegistryPayload> {
  constructor(
    subjectId: string,
    payload: WorkschedulePatternRecordAssociatedToEmployeeWorkscheduleRegistryPayload,
  ) {
    super({
      subjectId,
      subjectType: 'employeeWorkscheduleRegistry',
      eventDomain: 'HRIS_TIME',
      eventType:
        EmployeeWorkscheduleRegistryPrivateEventEnum.WORKSCHEDULE_PATTERN_ASSOCIATED_TO_EMPLOYEE_WORKSCHEDULE_REGISTRY,
      payload,
    })
  }
}
