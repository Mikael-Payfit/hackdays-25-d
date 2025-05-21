import { BusinessError } from '../../../../../common/errors';

export class PatternUpdateSameValueError extends BusinessError {
  constructor(public readonly patternId: string) {
    super(`Can not update pattern with same values ${patternId}`);
  }
}
