import { BusinessError } from '../../../../../common/errors';
import { ISOFormatDate } from '../../../../../common/models';

export class NoPatternAssociationError extends BusinessError {
  constructor(workschedulePatternRegistryId: string, date: ISOFormatDate) {
    super(
      `No pattern association found for workschedulePatternRegistryId: ${workschedulePatternRegistryId} for date ${date}`
    );
  }
}
