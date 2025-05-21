import { ISOFormatDate, MomentOfDay } from '@payfit/common-time-model'

import { LeavePeriodHelper } from './leave-period'

describe('LeavePeriod', () => {
  describe('from', () => {
    it('should create a LeavePeriod instance', () => {
      const begin = {
        date: '2023-01-01' as ISOFormatDate,
        moment: MomentOfDay.BEGINNING,
      }
      const end = {
        date: '2023-01-05' as ISOFormatDate,
        moment: MomentOfDay.END,
      }
      const leavePeriod = { begin, end }

      expect(leavePeriod.begin).toBe(begin)
      expect(leavePeriod.end).toBe(end)
    })
  })

  describe('equals', () => {
    it('should return true for equal periods', () => {
      const period1 = {
        begin: {
          date: '2023-01-01' as ISOFormatDate,
          moment: MomentOfDay.BEGINNING,
        },
        end: {
          date: '2023-01-05' as ISOFormatDate,
          moment: MomentOfDay.END,
        },
      }
      const period2 = {
        begin: {
          date: '2023-01-01' as ISOFormatDate,
          moment: MomentOfDay.BEGINNING,
        },
        end: {
          date: '2023-01-05' as ISOFormatDate,
          moment: MomentOfDay.END,
        },
      }

      expect(LeavePeriodHelper.isEquals(period1, period2)).toBe(true)
    })

    it('should return false for different periods', () => {
      const period1 = {
        begin: {
          date: '2023-01-01' as ISOFormatDate,
          moment: MomentOfDay.BEGINNING,
        },
        end: {
          date: '2023-01-05' as ISOFormatDate,
          moment: MomentOfDay.END,
        },
      }
      const period2 = {
        begin: {
          date: '2023-01-02' as ISOFormatDate,
          moment: MomentOfDay.BEGINNING,
        },
        end: {
          date: '2023-01-06' as ISOFormatDate,
          moment: MomentOfDay.END,
        },
      }

      expect(LeavePeriodHelper.isEquals(period1, period2)).toBe(false)
    })
  })

  describe('isOverlapping', () => {
    it('should return true for overlapping periods', () => {
      const period1 = {
        begin: {
          date: '2023-01-01' as ISOFormatDate,
          moment: MomentOfDay.BEGINNING,
        },
        end: {
          date: '2023-01-05' as ISOFormatDate,
          moment: MomentOfDay.END,
        },
      }
      const period2 = {
        begin: {
          date: '2023-01-03' as ISOFormatDate,
          moment: MomentOfDay.BEGINNING,
        },
        end: {
          date: '2023-01-07' as ISOFormatDate,
          moment: MomentOfDay.END,
        },
      }

      expect(LeavePeriodHelper.isOverlapping(period1, period2)).toBe(true)
    })

    it('should return false for non-overlapping periods', () => {
      const period1 = {
        begin: {
          date: '2023-01-01' as ISOFormatDate,
          moment: MomentOfDay.BEGINNING,
        },
        end: {
          date: '2023-01-05' as ISOFormatDate,
          moment: MomentOfDay.END,
        },
      }
      const period2 = {
        begin: {
          date: '2023-01-06' as ISOFormatDate,
          moment: MomentOfDay.BEGINNING,
        },
        end: {
          date: '2023-01-10' as ISOFormatDate,
          moment: MomentOfDay.END,
        },
      }

      expect(LeavePeriodHelper.isOverlapping(period1, period2)).toBe(false)
    })
  })

  describe('isEndDateAfterBeginDate', () => {
    it('should return true when end date is after begin date', () => {
      const period = {
        begin: {
          date: '2023-01-01' as ISOFormatDate,
          moment: MomentOfDay.BEGINNING,
        },
        end: {
          date: '2023-01-05' as ISOFormatDate,
          moment: MomentOfDay.END,
        },
      }

      expect(LeavePeriodHelper.isEndDateAfterBeginDate(period)).toBe(true)
    })

    it('should return true when end date is equal to begin date', () => {
      const period = {
        begin: {
          date: '2023-01-01' as ISOFormatDate,
          moment: MomentOfDay.BEGINNING,
        },
        end: {
          date: '2023-01-01' as ISOFormatDate,
          moment: MomentOfDay.END,
        },
      }

      expect(LeavePeriodHelper.isEndDateAfterBeginDate(period)).toBe(true)
    })

    it('should return false when end date is before begin date', () => {
      const period = {
        begin: {
          date: '2023-01-05' as ISOFormatDate,
          moment: MomentOfDay.BEGINNING,
        },
        end: {
          date: '2023-01-01' as ISOFormatDate,
          moment: MomentOfDay.END,
        },
      }

      expect(LeavePeriodHelper.isEndDateAfterBeginDate(period)).toBe(false)
    })
  })
})
