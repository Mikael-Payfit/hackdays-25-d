import { BusinessError } from '../../../../../common/errors';

export class PatternDefinitionInvalidSlotsSizeError extends BusinessError {
  constructor(public readonly patternId?: string) {
    super(`Pattern definition invalid slots size ${patternId ?? ''}`);
  }
}
