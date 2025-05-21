import { ILeaveRegistryAggregate } from '../leave-registry.aggregate.interface'
import { LeaveRecord } from '../value-objects'
import { hasExistingLeaveRecord } from './has-existing-leave-record.predicate'

const mockGetDataStore = jest.fn().mockReturnValue({
  leaveRecords: [],
})

describe('HasExistingLeaveRecordRule', () => {
  let aggregate: ILeaveRegistryAggregate

  const leaveRecord = {
    id: 'record-123',
  } as LeaveRecord

  beforeEach(() => {
    aggregate = {
      getDataStore: mockGetDataStore,
    } as unknown as ILeaveRegistryAggregate
  })

  describe('execute', () => {
    it('should return true when leave record exists', () => {
      mockGetDataStore.mockReturnValue({
        leaveRecords: [leaveRecord],
      })

      expect(
        hasExistingLeaveRecord(aggregate, { leaveRecordId: 'record-123' }),
      ).toBe(true)
    })

    it('should return false when leave record does not exist', () => {
      expect(
        hasExistingLeaveRecord(aggregate, {
          leaveRecordId: 'non-existent-record',
        }),
      ).toBe(false)
    })
  })
})
