import {
  addDays,
  addWeeks,
  endOfDay,
  endOfWeek,
  format,
  formatISO,
  startOfDay,
  startOfWeek,
  subWeeks,
} from 'date-fns'
import { DatePeriod, ISOFormatDate } from '../models'

export const dateIsAfterOrEqual = (
  dateToBeCompared: ISOFormatDate,
  dateToCompareTo: ISOFormatDate,
): boolean => {
  return new Date(dateToBeCompared) >= new Date(dateToCompareTo)
}

export const dateIsStrictlyAfter = (
  dateToBeCompared: ISOFormatDate,
  dateToCompareTo: ISOFormatDate,
): boolean => {
  return new Date(dateToBeCompared) > new Date(dateToCompareTo)
}

export const dateIsStrictlyBefore = (
  dateToBeCompared: ISOFormatDate,
  dateToCompareTo: ISOFormatDate,
): boolean => {
  return new Date(dateToBeCompared) < new Date(dateToCompareTo)
}

export const dateIsBeforeOrEqual = (
  dateToBeCompared: ISOFormatDate,
  dateToCompareTo: ISOFormatDate,
): boolean => {
  return new Date(dateToBeCompared) <= new Date(dateToCompareTo)
}

export function toISOFormatDay(date: Date): ISOFormatDate {
  return formatISO(date, { representation: 'date' }) as ISOFormatDate
}

export function addDaysToIsoDay(
  isoDay: ISOFormatDate,
  numberOfDays: number,
): ISOFormatDate {
  return toISOFormatDay(addDays(new Date(isoDay), numberOfDays))
}

export function getPeriodPerWeekDifFromToday(weekNumber: number): DatePeriod {
  const now = new Date()
  const startDate = format(
    startOfDay(startOfWeek(subWeeks(now, weekNumber), { weekStartsOn: 1 })),
    'yyyy-MM-dd',
  ) as ISOFormatDate // Monday 00:00 of the week weekNumber weeks ago
  const endDate = format(
    endOfDay(endOfWeek(addWeeks(now, weekNumber), { weekStartsOn: 1 })),
    'yyyy-MM-dd',
  ) as ISOFormatDate // Sunday 23:59 of the week weekNumber weeks ahead
  return { startDate, endDate }
}
