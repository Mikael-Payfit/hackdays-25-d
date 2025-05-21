import { addDays, format } from 'date-fns'

import { ISOFormatDate, MomentOfDay } from '@payfit/common-time-model'
import {
  leaveRecordPastPayPeriod,
  todayLeaveRecordRegistered,
} from '../../../__tests__'
import { ILeaveRegistryAggregate } from '../leave-registry.aggregate.interface'
import { ILeaveRecord, LeaveStatusHelper } from '../value-objects'
import { hasRegisteredOverlappingLeaveRecords } from './has-registered-overlapping-leave-records.predicate'

const mockGetDataStore = jest.fn()

describe('HasRegisteredOverlappingLeaveRecordsRule', () => {
  let aggregate: ILeaveRegistryAggregate
  const today: string = format(new Date(), 'yyyy-MM-dd')
  const tomorrow: string = format(addDays(new Date(), 1), 'yyyy-MM-dd')

  beforeEach(() => {
    aggregate = {
      getDataStore: mockGetDataStore,
    } as unknown as ILeaveRegistryAggregate

    mockGetDataStore.mockReturnValue({
      leaveRecords: [leaveRecordPastPayPeriod],
    })
  })

  afterEach(() => {
    mockGetDataStore.mockClear()
  })

  describe('execute', () => {
    it('should return false when there are no registered leave records', () => {
      // Given
      const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd')
      const leavePeriod = {
        begin: {
          date: today as ISOFormatDate,
          moment: MomentOfDay.BEGINNING,
        },
        end: {
          date: tomorrow as ISOFormatDate,
          moment: MomentOfDay.END,
        },
      }

      // When
      const result = hasRegisteredOverlappingLeaveRecords(aggregate, {
        leavePeriod,
      })

      // Then
      expect(result).toBe(false)
    })

    it('should return false when there are no overlapping registered leave records', () => {
      mockGetDataStore.mockReturnValue({
        leaveRecords: [leaveRecordPastPayPeriod],
      })

      // When
      const result = hasRegisteredOverlappingLeaveRecords(aggregate, {
        leavePeriod: todayLeaveRecordRegistered.leavePeriod,
      })

      // Then
      expect(result).toBe(false)
    })

    it('should return true when there are overlapping registered leave records', () => {
      mockGetDataStore.mockReturnValue({
        leaveRecords: [todayLeaveRecordRegistered],
      })

      // When
      const result = hasRegisteredOverlappingLeaveRecords(aggregate, {
        leavePeriod: todayLeaveRecordRegistered.leavePeriod,
      })

      // Then
      expect(result).toBe(true)
    })

    it('should return false when there are overlapping registered leave records but the leave record is the one we are updating', () => {
      // Given
      const existingLeaveRecord: ILeaveRecord = {
        id: 'existing-leave-1',
        from: 'leaveRecordsModel',
        leaveType: {
          name: 'fr_conges_payes',
          country: 'FR',
        },
        leavePeriod: {
          begin: {
            date: today as ISOFormatDate,
            moment: MomentOfDay.BEGINNING,
          },
          end: {
            date: today as ISOFormatDate,
            moment: MomentOfDay.END,
          },
        },
        leaveStatus: LeaveStatusHelper.getRegistered(),
        associatedExternalIds: [],
      }

      mockGetDataStore.mockReturnValue({
        leaveRecords: [existingLeaveRecord],
      })

      const leavePeriod = {
        begin: {
          date: tomorrow as ISOFormatDate,
          moment: MomentOfDay.BEGINNING,
        },
        end: {
          date: tomorrow as ISOFormatDate,
          moment: MomentOfDay.END,
        },
      }

      // When
      const result = hasRegisteredOverlappingLeaveRecords(aggregate, {
        leavePeriod,
        excludeLeaveRecordId: 'existing-leave-1',
      })

      // Then
      expect(result).toBe(false)
    })
  })
})

describe('hasRegisteredOverlappingLeaveRecords', () => {
  let aggregate: ILeaveRegistryAggregate
  const today: string = format(new Date(), 'yyyy-MM-dd')
  const tomorrow: string = format(addDays(new Date(), 1), 'yyyy-MM-dd')

  beforeEach(() => {
    aggregate = {
      getDataStore: mockGetDataStore,
    } as unknown as ILeaveRegistryAggregate

    mockGetDataStore.mockReturnValue({
      leaveRecords: [
        {
          id: 'today-leave-record',
          from: 'leaveRecordsModel',
          leaveType: {
            name: 'fr_conges_payes',
            country: 'FR',
          },
          leavePeriod: {
            begin: {
              date: today as ISOFormatDate,
              moment: MomentOfDay.BEGINNING,
            },
            end: {
              date: today as ISOFormatDate,
              moment: MomentOfDay.END,
            },
          },
          leaveStatus: LeaveStatusHelper.getDraft(),
          associatedExternalIds: [],
        },
      ],
    })
  })

  afterEach(() => {
    mockGetDataStore.mockClear()
  })

  describe('execute', () => {
    it('should return false when there are overlapping registered leave records but the leave record is the one we are updating', () => {
      const existingLeaveRecord: ILeaveRecord = {
        id: 'existing-leave-1',
        from: 'leaveRecordsModel',
        leaveType: {
          name: 'fr_conges_payes',
          country: 'FR',
        },
        leavePeriod: {
          begin: {
            date: today as ISOFormatDate,
            moment: MomentOfDay.BEGINNING,
          },
          end: {
            date: today as ISOFormatDate,
            moment: MomentOfDay.END,
          },
        },
        leaveStatus: LeaveStatusHelper.getRegistered(),
        associatedExternalIds: [],
      }

      mockGetDataStore.mockReturnValue({
        leaveRecords: [existingLeaveRecord],
      })

      const leavePeriod = {
        begin: {
          date: tomorrow as ISOFormatDate,
          moment: MomentOfDay.BEGINNING,
        },
        end: {
          date: tomorrow as ISOFormatDate,
          moment: MomentOfDay.END,
        },
      }

      const result = hasRegisteredOverlappingLeaveRecords(aggregate, {
        leavePeriod,
        excludeLeaveRecordId: 'existing-leave-1',
      })

      expect(result).toBe(false)
    })
  })
})
