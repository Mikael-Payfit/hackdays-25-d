/* eslint-disable @typescript-eslint/no-explicit-any */
import { Actor, systemActor } from '@payfit/common-time-model'
import {
  todayLeaveRecordCancelled,
  todayLeaveRecordRegistered,
} from '../../__tests__/fixtures/value-objects'
import {
  LeaveRecordNotFoundError,
  LeaveRecordNotOngoingError,
} from '../core/errors'
import { LeaveRegistryPrivateEventsEnum } from '../core/leave-registry-private-events.enum'
import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface'
import { cancelLeaveRecord } from './cancel-leave-record.operation'

const mockApplyBeforePersist = jest.fn()
const mockGetLeaveRegistryId = jest.fn().mockReturnValue('registry-123')
const mockGetLeaveRecordByLeaveRecordId = jest
  .fn()
  .mockReturnValue(todayLeaveRecordRegistered)
const mockGetVersion = jest.fn().mockReturnValue(1)

describe('CancelLeaveRecordRule', () => {
  let aggregate: ILeaveRegistryAggregate

  const defaultActor: Actor = systemActor

  beforeEach(() => {
    aggregate = {
      applyBeforePersist: mockApplyBeforePersist,
      getLeaveRegistryId: mockGetLeaveRegistryId,
      getLeaveRecordByLeaveRecordId: mockGetLeaveRecordByLeaveRecordId,
      getVersion: mockGetVersion,
    } as unknown as ILeaveRegistryAggregate
  })

  afterEach(() => {
    mockApplyBeforePersist.mockClear()
    mockGetLeaveRegistryId.mockClear()
    mockGetLeaveRecordByLeaveRecordId.mockClear()
    mockGetVersion.mockClear()
  })

  it('should cancel a leave record and return cancel event', () => {
    cancelLeaveRecord(aggregate, {
      actor: defaultActor,
      leaveRecordId: 'record-123',
      submissionId: 'submission-123',
    })

    expect(mockApplyBeforePersist).toHaveBeenCalledWith([
      expect.objectContaining({
        eventType: LeaveRegistryPrivateEventsEnum.LEAVE_CANCELLED,
        subjectId: 'registry-123',
        payload: {
          leaveRecordId: 'record-123',
          submissionId: 'submission-123',
          leaveRegistryId: 'registry-123',
          leaveRegistryVersion: 1,
          actor: defaultActor,
        },
      }),
    ])
  })

  it('should throw LeaveRecordNotFoundError when leave record does not exist', () => {
    mockGetLeaveRecordByLeaveRecordId.mockReturnValue(undefined)

    expect(() =>
      cancelLeaveRecord(aggregate, {
        actor: defaultActor,
        leaveRecordId: 'non-existent-record',
        submissionId: 'submission-123',
      }),
    ).toThrow(new LeaveRecordNotFoundError('non-existent-record'))
  })

  it('should throw LeaveRecordNotOngoingError when leave record is not ongoing', () => {
    mockGetLeaveRecordByLeaveRecordId.mockReturnValue(todayLeaveRecordCancelled)

    expect(() =>
      cancelLeaveRecord(aggregate, {
        actor: defaultActor,
        leaveRecordId: 'non-existent-record',
        submissionId: 'submission-123',
      }),
    ).toThrow(new LeaveRecordNotOngoingError('non-existent-record'))
  })
})
