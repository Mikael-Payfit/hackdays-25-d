import { BusinessError } from '../../../../common/errors';

export class InvalidContractError extends BusinessError {
  constructor() {
    super(
      `Invalid contract (contract start date after today or contract end date before today)`
    );
  }
}
