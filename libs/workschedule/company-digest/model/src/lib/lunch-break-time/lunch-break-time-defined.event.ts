import { Actor } from '@payfit/common-time-model'
import {
  EdpBaseEvent,
  EdpBasePayloadEvent,
  EdpSchemaChildType,
  EventProducerSchema,
} from '@payfit/edp-sdk'
import { IsDefined, IsObject, IsUUID, ValidateNested } from 'class-validator'
import { JSONSchema } from 'class-validator-jsonschema'
import { CompanyDigestPrivateEventEnum } from '../core/company-digest-private-event-enum'
import {
  DayLunchTimePayload,
  ILunchTimeDefinedPayload,
} from './lunch-break-time.models'

@EventProducerSchema({
  eventType: CompanyDigestPrivateEventEnum.LUNCH_BREAK_DEFINED,
  subjectType: 'companyDigest',
  description: 'Company Digest Lunch Break Defined event',
  majorVersion: 1,
  schemaName: 'company-digest-lunch-break-defined',
})
export class LunchTimeDefinedPayload extends EdpBasePayloadEvent {
  @IsUUID()
  @IsDefined()
  @JSONSchema({ description: 'The companyDigestId' })
  public companyDigestId: string

  @IsDefined()
  @IsObject()
  @ValidateNested({ each: true })
  @EdpSchemaChildType(DayLunchTimePayload)
  @JSONSchema({ description: 'The lunchTime of each day in a week' })
  public week: DayLunchTimePayload[]

  @IsObject()
  @IsDefined()
  @JSONSchema({ description: 'The actor' })
  public actor: Actor

  constructor(payload: ILunchTimeDefinedPayload) {
    super()
    this.companyDigestId = payload.companyDigestId
    this.week = payload.week.map((day) => new DayLunchTimePayload(day))
    this.actor = payload.actor
  }
}

export class LunchTimeDefinedEvent extends EdpBaseEvent<LunchTimeDefinedPayload> {
  constructor(subjectId: string, payload: LunchTimeDefinedPayload) {
    super({
      subjectId,
      subjectType: 'companyDigest',
      eventDomain: 'HRIS_TIME',
      eventType: CompanyDigestPrivateEventEnum.LUNCH_BREAK_DEFINED,
      payload,
    })
  }
}
