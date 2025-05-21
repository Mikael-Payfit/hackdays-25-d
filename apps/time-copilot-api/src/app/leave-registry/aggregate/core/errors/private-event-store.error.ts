import { TechnicalError } from '../../../../common/errors';

export class PrivateEventStoreError extends TechnicalError {
  constructor(message: string) {
    super('Error while sending events to the private event-store : ' + message);
  }
}
