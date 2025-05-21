/* eslint-disable @typescript-eslint/no-explicit-any */
import { ISOFormatDate, MomentOfDay } from '@payfit/common-time-model'
import {
  leaveRecordPastPayPeriod,
  todayLeaveRecordCancelled,
  todayLeaveRecordDraft,
} from '../../../__tests__'
import { ILeaveRegistryAggregate } from '../leave-registry.aggregate.interface'
import { getOngoingOverlappingLeaveRecordsFilter } from './get-ongoing-overlapping-leave-records.filter'

const mockGetDataStore = jest.fn().mockReturnValue({
  leaveRecords: [],
})

describe('GetOngoingOverlappingLeaveRecordsRule', () => {
  let aggregate: ILeaveRegistryAggregate

  const defaultLeavePeriod = {
    begin: {
      date: '2024-01-01' as ISOFormatDate,
      moment: MomentOfDay.BEGINNING,
    },
    end: {
      date: '2024-01-05' as ISOFormatDate,
      moment: MomentOfDay.END,
    },
  }

  beforeEach(() => {
    aggregate = {
      getDataStore: mockGetDataStore,
    } as unknown as ILeaveRegistryAggregate
  })

  it('should return empty array when no leave records provided', () => {
    mockGetDataStore.mockReturnValue({
      leaveRecords: [],
    })

    const result = getOngoingOverlappingLeaveRecordsFilter(aggregate, {
      leavePeriod: defaultLeavePeriod,
    })

    expect(result).toEqual([])
  })

  it('should return only ongoing and overlapping leave records', () => {
    mockGetDataStore.mockReturnValue({
      leaveRecords: [
        todayLeaveRecordDraft,
        todayLeaveRecordCancelled,
        leaveRecordPastPayPeriod,
      ],
    })

    const result = getOngoingOverlappingLeaveRecordsFilter(aggregate, {
      leavePeriod: todayLeaveRecordDraft.leavePeriod,
    })

    expect(result.length).toEqual(1)
    expect(result).toEqual([todayLeaveRecordDraft])
  })

  it('should handle records with undefined leavePeriod or leaveStatus', () => {
    mockGetDataStore.mockReturnValue({
      leaveRecords: [todayLeaveRecordDraft],
    })

    const result = getOngoingOverlappingLeaveRecordsFilter(aggregate, {
      leavePeriod: leaveRecordPastPayPeriod.leavePeriod,
    })

    expect(result).toEqual([])
  })
})
