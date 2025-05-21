import { TechnicalError } from './technical.error'

export class AggregateNotFoundError extends TechnicalError {
  constructor(public readonly aggregateId: string) {
    super(`Aggregate not found: ${aggregateId}`)
  }
}
