import { ISOFormatDate, Time, WeekDay } from '@payfit/common-time-model'

export interface PlannedWeekDay {
  date: ISOFormatDate
  day: WeekDay
  isPublicHoliday: boolean
  isJourOuvrable?: boolean
  isJourOuvre?: boolean
  lunchBreakTimeSlot: TimeSlot
  timeslots: TimeSlot[]
}

export type TimeSlot = {
  startTime: Time
  endTime: Time
  projectId?: string
  locationId?: string
}
