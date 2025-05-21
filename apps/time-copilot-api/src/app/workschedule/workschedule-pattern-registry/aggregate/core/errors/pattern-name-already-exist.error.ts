import { BusinessError } from '../../../../../common/errors';

export class PatternNameAlreadyExistError extends BusinessError {
  constructor(public readonly patternName: string) {
    super(`Pattern already exist`);
  }
}
