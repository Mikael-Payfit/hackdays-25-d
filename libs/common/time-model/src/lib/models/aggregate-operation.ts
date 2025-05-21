import { Aggregate } from './aggregate'

export abstract class AggregateOperation<DataStoreType, Input, Output> {
  constructor(protected readonly aggregate: Aggregate<DataStoreType>) {}

  abstract execute(input: Input): Output
}
