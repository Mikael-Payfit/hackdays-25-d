import {
  EdpBaseEvent,
  EdpBasePayloadEvent,
  IEdpEvent,
} from '@payfit/edp-models'

export const WORKSCHEDULE_CALENDAR_RECORD_PUBLIC_EVENT_PRODUCER =
  'WORKSCHEDULE_CALENDAR_RECORD_PUBLIC_EVENT_PRODUCER'

export interface IWorkscheduleCalendarRecordPublicEventProducer {
  sendEvent(
    event: EdpBaseEvent<EdpBasePayloadEvent>,
  ): Promise<IEdpEvent<EdpBasePayloadEvent>>

  sendEvents(
    events: EdpBaseEvent<EdpBasePayloadEvent>[],
  ): Promise<IEdpEvent<EdpBasePayloadEvent>[]>
}
