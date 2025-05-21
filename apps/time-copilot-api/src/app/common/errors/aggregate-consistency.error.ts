import { IEdpEvent } from '@payfit/edp-models'
import { EdpBasePayloadEvent } from '@payfit/edp-sdk'
import { TechnicalError } from './technical.error'

export class AggregateConsistencyError extends TechnicalError {
  constructor(
    public readonly events: IEdpEvent<EdpBasePayloadEvent>[],
    public readonly errors: string[],
  ) {
    super(
      'Aggregate consistency error: the events are not consistent with the aggregate',
    )
  }
}
