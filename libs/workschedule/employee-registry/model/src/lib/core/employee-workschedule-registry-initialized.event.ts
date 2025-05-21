import {
  EdpBaseEvent,
  EdpBasePayloadEvent,
  EventProducerSchema,
} from '@payfit/edp-sdk'
import { IsDefined, IsUUID } from 'class-validator'
import { JSONSchema } from 'class-validator-jsonschema'
import { EmployeeWorkscheduleRegistryPrivateEventEnum } from './employee-workschedule-registry-private-event-enum'

export interface IEmployeeWorkscheduleRegistryInitializedPayload {
  employeeWorkscheduleRegistryId: string
}

@EventProducerSchema({
  eventType:
    EmployeeWorkscheduleRegistryPrivateEventEnum.WORKSCHEDULE_EMPLOYEE_REGISTRY_INITIALIZED,
  subjectType: 'employeeWorkscheduleRegistry',
  description: ' Workweek Employee Registry Initialized Event',
  majorVersion: 3,
  schemaName: 'employee-workschedule-registry-initialized',
})
export class EmployeeWorkscheduleRegistryInitializedPayload extends EdpBasePayloadEvent {
  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The employeeWorkscheduleRegistryId' })
  public employeeWorkscheduleRegistryId: string

  constructor(payload: IEmployeeWorkscheduleRegistryInitializedPayload) {
    super()
    this.employeeWorkscheduleRegistryId = payload.employeeWorkscheduleRegistryId
  }
}

export class EmployeeWorkscheduleRegistryInitializedEvent extends EdpBaseEvent<EmployeeWorkscheduleRegistryInitializedPayload> {
  constructor(
    subjectId: string,
    payload: EmployeeWorkscheduleRegistryInitializedPayload,
  ) {
    super({
      subjectId,
      subjectType: 'employeeWorkscheduleRegistry',
      eventDomain: 'HRIS_TIME',
      eventType:
        EmployeeWorkscheduleRegistryPrivateEventEnum.WORKSCHEDULE_EMPLOYEE_REGISTRY_INITIALIZED,
      payload,
    })
  }
}
