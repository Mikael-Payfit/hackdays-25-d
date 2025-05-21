import {
  EdpBaseEvent,
  EdpBasePayloadEvent,
  EventProducerSchema,
} from '@payfit/edp-sdk'
import { IsDefined, IsUUID } from 'class-validator'
import { JSONSchema } from 'class-validator-jsonschema'
import { CompanyDigestPrivateEventEnum } from './company-digest-private-event-enum'

export interface ICompanyDigestInitializedPayload {
  companyDigestId: string
}

@EventProducerSchema({
  eventType: CompanyDigestPrivateEventEnum.COMPANY_DIGEST_INITIALIZED,
  subjectType: 'companyDigest',
  description: ' Workschedule Company Digest Initialized Event',
  majorVersion: 1,
  schemaName: 'workschedule-company-digest-initialized',
})
export class CompanyDigestInitializedPayload extends EdpBasePayloadEvent {
  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The workschedulePatternRegistryId' })
  public companyDigestId: string

  constructor(payload: ICompanyDigestInitializedPayload) {
    super()
    this.companyDigestId = payload.companyDigestId
  }
}

export class CompanyDigestInitializedEvent extends EdpBaseEvent<CompanyDigestInitializedPayload> {
  constructor(subjectId: string, payload: CompanyDigestInitializedPayload) {
    super({
      subjectId,
      subjectType: 'companyDigest',
      eventDomain: 'HRIS_TIME',
      eventType: CompanyDigestPrivateEventEnum.COMPANY_DIGEST_INITIALIZED,
      payload,
    })
  }
}
