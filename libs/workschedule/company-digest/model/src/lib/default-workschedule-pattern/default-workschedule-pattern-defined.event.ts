import {
  EdpBaseEvent,
  EdpBasePayloadEvent,
  EventProducerSchema,
} from '@payfit/edp-sdk'
import { IsDefined, IsUUID } from 'class-validator'
import { JSONSchema } from 'class-validator-jsonschema'
import { CompanyDigestPrivateEventEnum } from '../core/company-digest-private-event-enum'

export interface ICompanyDigestDefaultWorkschedulePatternDefinedPayload {
  companyDigestId: string
  workschedulePatternRecordId: string
  workschedulePatternRegistryId: string
  workschedulePatternRegistryVersion: number
}

@EventProducerSchema({
  eventType: CompanyDigestPrivateEventEnum.DEFAULT_WORKSCHEDULE_PATTERN_DEFINED,
  subjectType: 'companyDigest',
  description:
    ' Workschedule Company Digest Default Workschedule Pattern Defined Event',
  majorVersion: 1,
  schemaName:
    'workschedule-company-digest-default-workschedule-pattern-defined',
})
export class CompanyDigestDefaultWorkschedulePatternDefinedPayload extends EdpBasePayloadEvent {
  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The companyDigestId' })
  public companyDigestId: string

  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The companyDigestId' })
  public workschedulePatternRecordId: string

  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The companyDigestId' })
  public workschedulePatternRegistryId: string

  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The companyDigestId' })
  public workschedulePatternRegistryVersion: number

  constructor(payload: ICompanyDigestDefaultWorkschedulePatternDefinedPayload) {
    super()
    this.companyDigestId = payload.companyDigestId
    this.workschedulePatternRecordId = payload.workschedulePatternRecordId
    this.workschedulePatternRegistryId = payload.workschedulePatternRegistryId
    this.workschedulePatternRegistryVersion =
      payload.workschedulePatternRegistryVersion
  }
}

export class DefaultWorkschedulePatternDefinedEvent extends EdpBaseEvent<CompanyDigestDefaultWorkschedulePatternDefinedPayload> {
  constructor(
    subjectId: string,
    payload: CompanyDigestDefaultWorkschedulePatternDefinedPayload,
  ) {
    super({
      subjectId,
      subjectType: 'companyDigest',
      eventDomain: 'HRIS_TIME',
      eventType:
        CompanyDigestPrivateEventEnum.DEFAULT_WORKSCHEDULE_PATTERN_DEFINED,
      payload,
    })
  }
}
