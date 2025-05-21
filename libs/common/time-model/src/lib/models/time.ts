import { eachMonthOfInterval, endOfMonth, format, startOfMonth } from 'date-fns'
import { dateIsStrictlyAfter, dateIsStrictlyBefore } from '../helpers/date'

/**
 * The regex to check if a given expression is a valid Time value
 */
export const TIME_REGEX = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/

/**
 * Define a given week of week
 */
export type WeekDay =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'

/**
 * Define the time slot patterns for a given week day
 */
export type WeekDayDefinition = {
  isJourOuvre?: boolean
  isJourOuvrable?: boolean
  timeslots: TimeSlot[]
}

/**
 * Define a time value object in the format HH:mm
 */
export type Time = `${Hours}:${Minutes}`

type Hours =
  | '01'
  | '02'
  | '03'
  | '04'
  | '05'
  | '06'
  | '07'
  | '08'
  | '09'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'
  | '17'
  | '18'
  | '19'
  | '20'
  | '21'
  | '22'
  | '23'
type Minutes1 = `${0 | 1 | 2 | 3 | 4 | 5}`
type Minutes2 = `${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`
type Minutes = `${Minutes1}${Minutes2}`

/**
 * Define a time slot value object
 */
export type TimeSlot = {
  startTime: Time
  endTime: Time
  projectId?: string
  locationId?: string
}

export type DateTimeString = `${number}:${number}:${number}.${number}`
export type ISOFormatDate = `${number}-${number}-${number}` // ex: "2022-03-02" for March 2nd of 2022
export type ISOFormatDateTime = `${ISOFormatDate}T${DateTimeString}` // ex: "2022-03-02T08:00:00.000" for March 2nd of 2022, starting at 8AM without timezone
export type MonthYearDate = `${number}-${number}` // ex: "03-2022" for March 2022
export type DayMonthYearDate = `${number}/${number}/${number}` // ex: "02/03/2022" for March 2nd of 2022
export type ISOFormatMonth = `${number}-${number}` // ex: "2022-03" for March 2022

export enum MomentOfDay {
  BEGINNING = 'beginning-of-day',
  MIDDLE = 'middle-of-day',
  END = 'end-of-day',
}

export type DateWithMoment = {
  date: ISOFormatDate
  moment: MomentOfDay
}

export type DatePeriod = {
  startDate: ISOFormatDate
  endDate: ISOFormatDate
}

export type DatePeriodWithoutEnd = Omit<DatePeriod, 'endDate'> & {
  endDate?: ISOFormatDate
}

export class DatePeriodHelper {
  public static isEqual(
    period1: DatePeriodWithoutEnd | DatePeriod,
    period2: DatePeriodWithoutEnd | DatePeriod,
  ): boolean {
    return (
      period1.startDate === period2.startDate &&
      period1.endDate === period2.endDate
    )
  }

  public static isBefore(
    period1: DatePeriodWithoutEnd | DatePeriod,
    period2: DatePeriodWithoutEnd | DatePeriod,
  ): boolean {
    if (!period1.endDate) {
      return false
    }

    return period1.endDate < period2.startDate
  }

  public static isAfter(
    period1: DatePeriodWithoutEnd | DatePeriod,
    period2: DatePeriodWithoutEnd | DatePeriod,
  ): boolean {
    if (!period2.endDate) {
      return false
    }

    return period1.startDate > period2.endDate
  }

  public static isOverlapping(
    period1: DatePeriodWithoutEnd | DatePeriod,
    period2: DatePeriodWithoutEnd | DatePeriod,
  ): boolean {
    return !this.isBefore(period1, period2) && !this.isAfter(period1, period2)
  }
}

export class DateWithMomentHelper {
  public static isEquals(
    dateWithMoment1: DateWithMoment,
    dateWithMoment2: DateWithMoment,
  ): boolean {
    return (
      dateWithMoment1.date === dateWithMoment2.date &&
      dateWithMoment1.moment === dateWithMoment2.moment
    )
  }

  public static isBefore(
    dateWithMoment1: DateWithMoment,
    dateWithMoment2: DateWithMoment,
  ): boolean {
    if (dateIsStrictlyBefore(dateWithMoment1.date, dateWithMoment2.date)) {
      return true
    }
    if (dateWithMoment1.date === dateWithMoment2.date) {
      return (
        (dateWithMoment1.moment === MomentOfDay.BEGINNING &&
          dateWithMoment2.moment !== MomentOfDay.BEGINNING) ||
        (dateWithMoment1.moment === MomentOfDay.MIDDLE &&
          dateWithMoment2.moment === MomentOfDay.END)
      )
    }
    return false
  }

  public static isAfter(
    dateWithMoment1: DateWithMoment,
    dateWithMoment2: DateWithMoment,
  ): boolean {
    if (dateIsStrictlyAfter(dateWithMoment1.date, dateWithMoment2.date)) {
      return true
    }
    if (dateWithMoment1.date === dateWithMoment2.date) {
      return (
        (dateWithMoment1.moment === MomentOfDay.END &&
          dateWithMoment2.moment !== MomentOfDay.END) ||
        (dateWithMoment1.moment === MomentOfDay.MIDDLE &&
          dateWithMoment2.moment === MomentOfDay.BEGINNING)
      )
    }
    return false
  }

  public static isAfterOrEqual(
    dateWithMoment1: DateWithMoment,
    dateWithMoment2: DateWithMoment,
  ): boolean {
    return (
      DateWithMomentHelper.isAfter(dateWithMoment1, dateWithMoment2) ||
      DateWithMomentHelper.isEquals(dateWithMoment1, dateWithMoment2)
    )
  }

  public static getDateMonthPeriod(date: ISOFormatDate): DatePeriod {
    const inputDate = new Date(date)
    const year = inputDate.getFullYear()
    const month = inputDate.getMonth()

    const startDate = new Date(year, month, 1)
      .toISOString()
      .split('T')[0] as ISOFormatDate
    const endDate = new Date(year, month + 1, 0)
      .toISOString()
      .split('T')[0] as ISOFormatDate

    return { startDate, endDate }
  }

  private static getMonthPeriodForOffset(
    date: ISOFormatDate,
    monthOffset = 0,
  ): DatePeriod {
    const inputDate = new Date(date)
    const year = inputDate.getFullYear()
    const month = inputDate.getMonth()

    const startDate = new Date(year, month + monthOffset, 1)
      .toISOString()
      .split('T')[0] as ISOFormatDate

    const endDate = new Date(year, month + monthOffset + 1, 0)
      .toISOString()
      .split('T')[0] as ISOFormatDate

    return { startDate, endDate }
  }

  public static getNextMonthPeriod(date: ISOFormatDate): DatePeriod {
    return this.getMonthPeriodForOffset(date, 1)
  }

  public static getPreviousMonthPeriod(date: ISOFormatDate): DatePeriod {
    return this.getMonthPeriodForOffset(date, -1)
  }

  public static getMonthPeriod(date: ISOFormatDate): DatePeriod {
    return this.getMonthPeriodForOffset(date)
  }
}

export function getMonthsInPeriod(period: DatePeriod): DatePeriod[] {
  const startMonths = eachMonthOfInterval({
    start: new Date(period.startDate),
    end: new Date(period.endDate),
  })

  const periods = startMonths.map(
    (startDate) =>
      ({
        startDate: format(startOfMonth(startDate), 'yyyy-MM-dd'),
        endDate: format(endOfMonth(startDate), 'yyyy-MM-dd'),
      }) as DatePeriod,
  )
  return periods
}

export interface ConsolidatedPeriod extends DatePeriod {
  type: 'create' | 'delete' | 'update'
}

export function consolidatePeriods({
  oldPeriods,
  newPeriods,
}: {
  oldPeriods: DatePeriod[]
  newPeriods: DatePeriod[]
}): ConsolidatedPeriod[] {
  const createPeriodKey = (period: DatePeriod): string => {
    return `${period.startDate}|${period.endDate}`
  }

  const oldPeriodsMap = new Map<string, DatePeriod>()
  const newPeriodsMap = new Map<string, DatePeriod>()

  oldPeriods.forEach((period) => {
    oldPeriodsMap.set(createPeriodKey(period), period)
  })

  newPeriods.forEach((period) => {
    newPeriodsMap.set(createPeriodKey(period), period)
  })

  const consolidatedPeriods: ConsolidatedPeriod[] = []

  oldPeriods.forEach((period) => {
    const key = createPeriodKey(period)
    if (newPeriodsMap.has(key)) {
      consolidatedPeriods.push({
        ...period,
        type: 'update',
      })
    } else {
      consolidatedPeriods.push({
        ...period,
        type: 'delete',
      })
    }
  })

  newPeriods.forEach((period) => {
    const key = createPeriodKey(period)
    if (!oldPeriodsMap.has(key)) {
      consolidatedPeriods.push({
        ...period,
        type: 'create',
      })
    }
  })

  return consolidatedPeriods
}
