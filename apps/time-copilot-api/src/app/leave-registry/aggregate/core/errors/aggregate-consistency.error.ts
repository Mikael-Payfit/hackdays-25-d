import { EdpBasePayloadEvent, IEdpEvent } from '@payfit/edp-sdk';
import { TechnicalError } from '../../../../common/errors';

export class AggregateConsistencyError extends TechnicalError {
  constructor(events: IEdpEvent<EdpBasePayloadEvent>[], errors: string[]) {
    super(
      'Aggregate consistency error: the events are not consistent with the aggregate : ' +
        errors.join(', ') +
        '\nEvents : ' +
        events.map((e) => e.eventType)
    );
  }
}
