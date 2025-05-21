import { TechnicalError } from '../../../../common/errors';

export class PublicEventStoreError extends TechnicalError {
  constructor(message: string) {
    super('Error while sending events to the public event-store : ' + message);
  }
}
