import { ILeaveRegistryAggregate } from '../leave-registry.aggregate.interface'
import { Submission } from '../value-objects'
import { getLastOpenSubmissionForLeaveRecordFilter } from './get-last-open-submissions-for-leave-record.filter'

const mockGetOpenSubmissionsForLeaveRecord = jest.fn()

describe('GetLastOpenSubmissionForLeaveRecordRule', () => {
  let aggregate: ILeaveRegistryAggregate

  const defaultSubmission: Submission = {
    id: 'submission-123',
  } as Submission

  beforeEach(() => {
    aggregate = {
      snapshot: {
        dataStore: {
          leaveRegistryId: 'registry-123',
          leaveRecords: [],
          submissions: [],
          associatedExternalIds: [],
        },
      },
      getOpenSubmissionsForLeaveRecord: mockGetOpenSubmissionsForLeaveRecord,
    } as unknown as ILeaveRegistryAggregate
  })

  afterEach(() => {
    mockGetOpenSubmissionsForLeaveRecord.mockClear()
  })

  it('should return undefined when no open submissions exist', () => {
    mockGetOpenSubmissionsForLeaveRecord.mockReturnValue([])

    const result = getLastOpenSubmissionForLeaveRecordFilter(aggregate, {
      leaveRecordId: 'record-123',
    })

    expect(result).toBeUndefined()
    expect(mockGetOpenSubmissionsForLeaveRecord).toHaveBeenCalledWith({
      leaveRecordId: 'record-123',
    })
  })

  it('should return the last submission when open submissions exist', () => {
    const submissions = [
      { ...defaultSubmission, id: 'submission-1' },
      { ...defaultSubmission, id: 'submission-2' },
    ]

    mockGetOpenSubmissionsForLeaveRecord.mockReturnValue(submissions)

    const result = getLastOpenSubmissionForLeaveRecordFilter(aggregate, {
      leaveRecordId: 'record-123',
    })

    expect(result).toEqual({
      ...defaultSubmission,
      id: 'submission-2',
    })
    expect(mockGetOpenSubmissionsForLeaveRecord).toHaveBeenCalledWith({
      leaveRecordId: 'record-123',
    })
  })

  it('should return the only submission when one open submission exists', () => {
    mockGetOpenSubmissionsForLeaveRecord.mockReturnValue([defaultSubmission])

    const result = getLastOpenSubmissionForLeaveRecordFilter(aggregate, {
      leaveRecordId: 'record-123',
    })

    expect(result).toEqual(defaultSubmission)
    expect(mockGetOpenSubmissionsForLeaveRecord).toHaveBeenCalledWith({
      leaveRecordId: 'record-123',
    })
  })
})
