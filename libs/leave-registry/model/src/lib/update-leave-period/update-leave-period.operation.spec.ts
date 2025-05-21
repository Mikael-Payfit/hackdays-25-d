import { Actor, systemActor } from '@payfit/common-time-model'
import {
  invalidLeaveRecordDraft,
  todayLeaveRecordDraft,
  yesterdayLeaveRecordRegistered,
} from '../../__tests__'
import {
  InvalidLeavePeriodError,
  InvalidLeavePeriodUpdateError,
  LeaveRecordNotFoundError,
  OverlappingLeaveError,
} from '../core/errors'
import { LeaveRegistryPrivateEventsEnum } from '../core/leave-registry-private-events.enum'
import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface'
import { LeavePeriod } from '../core/value-objects/leave-period'
import { updateLeavePeriod } from './update-leave-period.operation'

const mockGetLeaveRegistryId = jest.fn()
const mockApplyBeforePersist = jest.fn()
const mockIsNewLeavePeriodValid = jest.fn()
const mockHasExistingLeaveRecord = jest.fn()
const mockHasRegisteredOverlappingLeaveRecords = jest.fn()
const mockGetLeaveRecordByLeaveRecordId = jest.fn()
const mockGetVersion = jest.fn().mockReturnValue(1)

describe('UpdateLeavePeriodRule', () => {
  let aggregate: ILeaveRegistryAggregate

  const defaultActor: Actor = systemActor

  beforeEach(() => {
    aggregate = {
      getLeaveRegistryId: mockGetLeaveRegistryId,
      applyBeforePersist: mockApplyBeforePersist,
      isNewLeavePeriodValid: mockIsNewLeavePeriodValid,
      hasExistingLeaveRecord: mockHasExistingLeaveRecord,
      hasRegisteredOverlappingLeaveRecords:
        mockHasRegisteredOverlappingLeaveRecords,
      getLeaveRecordByLeaveRecordId: mockGetLeaveRecordByLeaveRecordId,
      getVersion: mockGetVersion,
    } as unknown as ILeaveRegistryAggregate

    mockGetLeaveRegistryId.mockReturnValue('test-leave-registry-id')
    mockIsNewLeavePeriodValid.mockReturnValue(true)
    mockHasExistingLeaveRecord.mockReturnValue(true)
    mockHasRegisteredOverlappingLeaveRecords.mockReturnValue(false)
    mockGetLeaveRecordByLeaveRecordId.mockReturnValue({
      id: 'record-123',
      leavePeriod: yesterdayLeaveRecordRegistered.leavePeriod,
    })
  })

  afterEach(() => {
    mockGetLeaveRegistryId.mockClear()
    mockApplyBeforePersist.mockClear()
    mockIsNewLeavePeriodValid.mockClear()
    mockHasExistingLeaveRecord.mockClear()
    mockHasRegisteredOverlappingLeaveRecords.mockClear()
    mockGetLeaveRecordByLeaveRecordId.mockClear()
  })

  it('should update a leave record and return update event', () => {
    const newLeavePeriod: LeavePeriod = todayLeaveRecordDraft.leavePeriod

    updateLeavePeriod(aggregate, {
      actor: defaultActor,
      leaveRecordId: 'record-123',
      submissionId: 'mock-submission-123',
      newLeavePeriod,
    })

    expect(mockApplyBeforePersist).toHaveBeenCalledWith([
      expect.objectContaining({
        eventType: LeaveRegistryPrivateEventsEnum.LEAVE_PERIOD_UPDATED,
        subjectId: 'test-leave-registry-id',
        payload: {
          submissionId: 'mock-submission-123',
          leaveRegistryId: 'test-leave-registry-id',
          leaveRegistryVersion: 1,
          actor: defaultActor,
          newBeginDate: todayLeaveRecordDraft.leavePeriod.begin.date,
          newBeginMoment: todayLeaveRecordDraft.leavePeriod.begin.moment,
          newEndDate: todayLeaveRecordDraft.leavePeriod.end.date,
          newEndMoment: todayLeaveRecordDraft.leavePeriod.end.moment,
          leaveRecordId: 'record-123',
        },
      }),
    ])
  })

  it('should throw InvalidLeavePeriodError when leave period is not valid', () => {
    mockIsNewLeavePeriodValid.mockImplementation(() => {
      throw new InvalidLeavePeriodError(['End date must be after Begin date'])
    })

    expect(() =>
      updateLeavePeriod(aggregate, {
        actor: defaultActor,
        leaveRecordId: 'record-123',
        submissionId: 'test-submission-id',
        newLeavePeriod: invalidLeaveRecordDraft.leavePeriod,
      }),
    ).toThrow(
      new InvalidLeavePeriodError(['End date must be after Begin date']),
    )
  })

  it('should throw InvalidLeavePeriodUpdateError when leave period is the same as before', () => {
    expect(() =>
      updateLeavePeriod(aggregate, {
        actor: defaultActor,
        leaveRecordId: 'record-123',
        submissionId: 'test-submission-id',
        newLeavePeriod: yesterdayLeaveRecordRegistered.leavePeriod,
      }),
    ).toThrow(
      new InvalidLeavePeriodUpdateError([
        'New leave period should be different than the original',
      ]),
    )
  })

  it('should throw LeaveRecordNotFoundError when leave record does not exist', () => {
    mockGetLeaveRecordByLeaveRecordId.mockReturnValue(undefined)

    expect(() =>
      updateLeavePeriod(aggregate, {
        actor: defaultActor,
        leaveRecordId: 'non-existent-record',
        submissionId: 'test-submission-id',
        newLeavePeriod: todayLeaveRecordDraft.leavePeriod,
      }),
    ).toThrow(new LeaveRecordNotFoundError('non-existent-record'))
  })

  it('should throw OverlappingLeaveError when there are overlapping leaves', () => {
    mockHasRegisteredOverlappingLeaveRecords.mockReturnValue(true)

    expect(() =>
      updateLeavePeriod(aggregate, {
        actor: defaultActor,
        leaveRecordId: 'record-123',
        submissionId: 'test-submission-id',
        newLeavePeriod: todayLeaveRecordDraft.leavePeriod,
      }),
    ).toThrow(OverlappingLeaveError)
  })
})
