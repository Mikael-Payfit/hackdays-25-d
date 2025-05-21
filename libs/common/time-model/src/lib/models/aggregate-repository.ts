import { Aggregate } from '../models'

export abstract class AggregateRepository<T extends Aggregate<unknown>> {
  public abstract save(aggregate: T): Promise<void>
}
