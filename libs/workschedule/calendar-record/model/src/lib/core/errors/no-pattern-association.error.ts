import { BusinessError, ISOFormatDate } from '@payfit/common-time-model'

export class NoPatternAssociationError extends BusinessError {
  constructor(workschedulePatternRegistryId: string, date: ISOFormatDate) {
    super(
      `No pattern association found for workschedulePatternRegistryId: ${workschedulePatternRegistryId} for date ${date}`,
    )
  }
}
