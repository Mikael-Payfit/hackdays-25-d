import { BusinessError } from '@payfit/common-time-model'

export class InvalidContractError extends BusinessError {
  constructor() {
    super(
      `Invalid contract (contract start date after today or contract end date before today)`,
    )
  }
}
