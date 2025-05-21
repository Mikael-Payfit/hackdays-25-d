import { ISOFormatDate } from '@payfit/common-time-model'

export const PUBLIC_HOLIDAYS_SERVICE = 'PUBLIC_HOLIDAYS_SERVICE'

export interface IPublicHolidaysService {
  getEmployeePublicHolidays(
    employeeId: string,
  ): Promise<Record<ISOFormatDate, string>>
}
