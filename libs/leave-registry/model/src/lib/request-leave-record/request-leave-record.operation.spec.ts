import { Actor, systemActor } from '@payfit/common-time-model'
import { invalidLeaveRecordDraft, todayLeaveRecordDraft } from '../../__tests__'
import { InvalidLeavePeriodError, OverlappingLeaveError } from '../core/errors'
import { LeaveRegistryPrivateEventsEnum } from '../core/leave-registry-private-events.enum'
import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface'
import { requestLeaveRecord } from './request-leave-record.operation'

const mockApplyBeforePersist = jest.fn()
const mockGetLeaveRegistryId = jest.fn().mockReturnValue('registry-123')
const mockHasRegisteredOverlappingLeaveRecords = jest
  .fn()
  .mockReturnValue(false)
const mockGetVersion = jest.fn().mockReturnValue(1)
const mockGenerateNewEntityId = jest
  .fn()
  .mockReturnValue(todayLeaveRecordDraft.id)

jest.mock('@payfit/common-time-model', () => ({
  ...jest.requireActual('@payfit/common-time-model'),
  generateNewEntityId: () => mockGenerateNewEntityId(),
}))

describe('RequestLeaveRecordRule', () => {
  const aggregate = {
    getLeaveRegistryId: mockGetLeaveRegistryId,
    hasRegisteredOverlappingLeaveRecords:
      mockHasRegisteredOverlappingLeaveRecords,
    applyBeforePersist: mockApplyBeforePersist,
    getVersion: mockGetVersion,
  } as unknown as ILeaveRegistryAggregate
  const defaultActor: Actor = systemActor

  beforeEach(() => {
    mockGenerateNewEntityId.mockClear()
  })

  afterEach(() => {
    mockGetLeaveRegistryId.mockClear()
    mockHasRegisteredOverlappingLeaveRecords.mockClear()
    mockApplyBeforePersist.mockClear()
    mockGetVersion.mockClear()
  })

  it('should throw error when the leave period is not valid', () => {
    expect(() =>
      requestLeaveRecord(aggregate, {
        leaveType: invalidLeaveRecordDraft.leaveType,
        leavePeriod: invalidLeaveRecordDraft.leavePeriod,
        submissionId: 'submission-123',
        actor: defaultActor,
      }),
    ).toThrow(InvalidLeavePeriodError)
  })

  it('should throw error when there is an overlapping leave', () => {
    mockHasRegisteredOverlappingLeaveRecords.mockReturnValue(true)

    expect(() =>
      requestLeaveRecord(aggregate, {
        leaveType: todayLeaveRecordDraft.leaveType,
        leavePeriod: todayLeaveRecordDraft.leavePeriod,
        submissionId: 'submission-123',
        actor: defaultActor,
      }),
    ).toThrow(OverlappingLeaveError)
  })

  it('should request a leave record and return events', () => {
    mockHasRegisteredOverlappingLeaveRecords.mockReturnValue(false)

    const result = requestLeaveRecord(aggregate, {
      leaveType: todayLeaveRecordDraft.leaveType,
      leavePeriod: todayLeaveRecordDraft.leavePeriod,
      submissionId: 'submission-123',
      actor: defaultActor,
    })

    expect(mockGenerateNewEntityId).toHaveBeenCalledTimes(1)
    expect(result.leaveRecordId).toBe(todayLeaveRecordDraft.id)
    expect(mockApplyBeforePersist).toHaveBeenCalledWith([
      expect.objectContaining({
        eventType: LeaveRegistryPrivateEventsEnum.LEAVE_REQUESTED,
        subjectId: 'registry-123',
        payload: {
          leaveRecordId: todayLeaveRecordDraft.id,
          submissionId: 'submission-123',
          leaveRegistryId: 'registry-123',
          leaveRegistryVersion: 1,
          actor: defaultActor,
          type: todayLeaveRecordDraft.leaveType.name,
          country: todayLeaveRecordDraft.leaveType.country,
          beginDate: todayLeaveRecordDraft.leavePeriod.begin.date,
          beginMoment: todayLeaveRecordDraft.leavePeriod.begin.moment,
          endDate: todayLeaveRecordDraft.leavePeriod.end.date,
          endMoment: todayLeaveRecordDraft.leavePeriod.end.moment,
        },
      }),
    ])
  })
})
