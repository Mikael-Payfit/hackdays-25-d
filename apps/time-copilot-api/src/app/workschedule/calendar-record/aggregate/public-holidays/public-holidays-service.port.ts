import { ISOFormatDate } from '../../../../common/models';

export const PUBLIC_HOLIDAYS_SERVICE = 'PUBLIC_HOLIDAYS_SERVICE';

export interface IPublicHolidaysService {
  getEmployeePublicHolidays(
    employeeId: string
  ): Promise<Record<ISOFormatDate, string>>;
}
