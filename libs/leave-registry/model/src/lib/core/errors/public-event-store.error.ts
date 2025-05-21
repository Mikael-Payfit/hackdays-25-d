import { TechnicalError } from '@payfit/common-time-model'

export class PublicEventStoreError extends TechnicalError {
  constructor(message: string) {
    super('Error while sending events to the public event-store : ' + message)
  }
}
