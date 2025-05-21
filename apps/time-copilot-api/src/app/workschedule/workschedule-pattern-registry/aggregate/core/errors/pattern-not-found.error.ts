import { BusinessError } from '../../../../../common/errors';

export class PatternNotFoundError extends BusinessError {
  constructor() {
    super(`Pattern not found`);
  }
}
