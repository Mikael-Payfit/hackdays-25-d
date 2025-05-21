import { BusinessError } from '../../../../common/errors';

export class JLContractNotFoundError extends BusinessError {
  constructor(jlContractId: string) {
    super(
      `No JLContract link to LeaveRegistry found for jlContractId ${jlContractId}`
    );
  }
}
