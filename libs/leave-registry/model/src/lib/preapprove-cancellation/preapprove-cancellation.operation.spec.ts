import { Actor, systemActor } from '@payfit/common-time-model'
import { LeaveRegistryPrivateEventsEnum } from '../core/leave-registry-private-events.enum'
import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface'
import { preapproveCancellation } from './preapprove-cancellation.operation'

const mockApplyBeforePersist = jest.fn()
const mockGetLeaveRegistryId = jest.fn()
const mockCancelLeaveRecord = jest.fn()
const mockGetLastOpenSubmissionForLeaveRecord = jest.fn().mockReturnValue({
  submissionId: 'old-submission-123',
})
const mockIsLeaveRecordLastOneNotCompletedForSubmission = jest
  .fn()
  .mockReturnValue(true)
const mockDiscardSubmission = jest.fn()
const mockGetVersion = jest.fn().mockReturnValue(1)

const mockGenerateNewEntityId = jest.fn().mockReturnValue('mock-submission-123')

jest.mock('@payfit/common-time-model', () => ({
  ...jest.requireActual('@payfit/common-time-model'),
  generateNewEntityId: () => mockGenerateNewEntityId(),
}))

describe('PreapproveCancellationRule', () => {
  let aggregate: ILeaveRegistryAggregate

  const defaultActor: Actor = systemActor

  beforeEach(() => {
    aggregate = {
      getLeaveRegistryId: mockGetLeaveRegistryId,
      applyBeforePersist: mockApplyBeforePersist,
      cancelLeaveRecord: mockCancelLeaveRecord,
      getLastOpenSubmissionForLeaveRecord:
        mockGetLastOpenSubmissionForLeaveRecord,
      isLeaveRecordLastOneNotCompletedForSubmission:
        mockIsLeaveRecordLastOneNotCompletedForSubmission,
      discardSubmission: mockDiscardSubmission,
      getVersion: mockGetVersion,
    } as unknown as ILeaveRegistryAggregate

    mockGetLeaveRegistryId.mockReturnValue('registry-123')
  })

  afterEach(() => {
    mockApplyBeforePersist.mockClear()
    mockGetLeaveRegistryId.mockClear()
    mockCancelLeaveRecord.mockClear()
    mockGetLastOpenSubmissionForLeaveRecord.mockClear()
    mockIsLeaveRecordLastOneNotCompletedForSubmission.mockClear()
    mockDiscardSubmission.mockClear()
    mockGetVersion.mockClear()
    mockGenerateNewEntityId.mockClear()
  })

  it('should submit a preapproved cancellation request and cancel a leave record when there is no ongoing submission', () => {
    const result = preapproveCancellation(aggregate, {
      actor: defaultActor,
      leaveRecordId: 'record-123',
    })

    expect(result.submissionId).toEqual('mock-submission-123')

    expect(mockApplyBeforePersist).toHaveBeenCalledWith([
      expect.objectContaining({
        eventType: LeaveRegistryPrivateEventsEnum.CANCELLATION_PREAPPROVED,
        subjectId: 'registry-123',
        payload: {
          submissionId: 'mock-submission-123',
          leaveRegistryId: 'registry-123',
          leaveRegistryVersion: 1,
          actor: defaultActor,
        },
      }),
    ])

    expect(mockCancelLeaveRecord).toHaveBeenCalledWith({
      leaveRecordId: 'record-123',
      submissionId: 'mock-submission-123',
      actor: defaultActor,
    })
  })

  it('should discard old submission when leave record is the last one not completed in the submission', () => {
    const oldSubmission = {
      id: 'old-submission-123',
    }
    mockGetLastOpenSubmissionForLeaveRecord.mockReturnValue(oldSubmission)
    mockIsLeaveRecordLastOneNotCompletedForSubmission.mockReturnValue(true)

    preapproveCancellation(aggregate, {
      actor: defaultActor,
      leaveRecordId: 'record-123',
    })

    expect(mockDiscardSubmission).toHaveBeenCalledWith({
      submissionId: 'old-submission-123',
      actor: defaultActor,
    })
  })

  it('should not discard old submission when leave record is not the last one not completed in the submission', () => {
    const oldSubmission = {
      submissionId: 'old-submission-123',
    }
    mockGetLastOpenSubmissionForLeaveRecord.mockReturnValue(oldSubmission)
    mockIsLeaveRecordLastOneNotCompletedForSubmission.mockReturnValue(false)

    preapproveCancellation(aggregate, {
      actor: defaultActor,
      leaveRecordId: 'record-123',
    })

    expect(mockDiscardSubmission).not.toHaveBeenCalled()
  })

  it('should not discard old submission when there is no open submission for the leave record', () => {
    mockGetLastOpenSubmissionForLeaveRecord.mockReturnValue(undefined)

    preapproveCancellation(aggregate, {
      actor: defaultActor,
      leaveRecordId: 'record-123',
    })

    expect(mockDiscardSubmission).not.toHaveBeenCalled()
  })
})
