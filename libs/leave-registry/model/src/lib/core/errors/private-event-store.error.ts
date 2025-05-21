import { TechnicalError } from '@payfit/common-time-model'

export class PrivateEventStoreError extends TechnicalError {
  constructor(message: string) {
    super('Error while sending events to the private event-store : ' + message)
  }
}
