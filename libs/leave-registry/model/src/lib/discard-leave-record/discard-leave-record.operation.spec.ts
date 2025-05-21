/* eslint-disable @typescript-eslint/no-explicit-any */

import { Actor, systemActor } from '@payfit/common-time-model'
import {
  LeaveRecordNotDraftError,
  LeaveRecordNotFoundError,
} from '../core/errors'
import { LeaveRegistryPrivateEventsEnum } from '../core/leave-registry-private-events.enum'
import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface'
import { discardLeaveRecord } from './discard-leave-record.operation'

const mockGetLeaveRecordByLeaveRecordId = jest.fn()
const mockApplyBeforePersist = jest.fn()
const mockGetLeaveRegistryId = jest.fn().mockReturnValue('registry-123')
const mockGetVersion = jest.fn().mockReturnValue(1)

describe('DiscardLeaveRecordRule', () => {
  let aggregate: ILeaveRegistryAggregate

  const defaultActor: Actor = systemActor

  beforeEach(() => {
    aggregate = {
      getLeaveRecordByLeaveRecordId: mockGetLeaveRecordByLeaveRecordId,
      applyBeforePersist: mockApplyBeforePersist,
      getLeaveRegistryId: mockGetLeaveRegistryId,
      getVersion: mockGetVersion,
    } as unknown as ILeaveRegistryAggregate
  })

  it('should discard a leave record and return discard event', () => {
    mockGetLeaveRecordByLeaveRecordId.mockReturnValue({
      isDraft: () => true,
    })

    discardLeaveRecord(aggregate, {
      actor: defaultActor,
      leaveRecordId: 'record-123',
      submissionId: 'submission-123',
    })

    expect(mockApplyBeforePersist).toHaveBeenCalledWith([
      expect.objectContaining({
        eventType: LeaveRegistryPrivateEventsEnum.LEAVE_DISCARDED,
        subjectId: 'registry-123',
        payload: expect.objectContaining({
          leaveRecordId: 'record-123',
          submissionId: 'submission-123',
          leaveRegistryId: 'registry-123',
          leaveRegistryVersion: 1,
          actor: defaultActor,
        }),
      }),
    ])
  })

  it('should throw LeaveRecordNotFoundError when leave record does not exist', () => {
    mockGetLeaveRecordByLeaveRecordId.mockReturnValue(null)

    expect(() =>
      discardLeaveRecord(aggregate, {
        actor: defaultActor,
        leaveRecordId: 'record-123',
        submissionId: 'submission-123',
      }),
    ).toThrow(new LeaveRecordNotFoundError('record-123'))
  })

  it('should throw LeaveRecordNotDraftError when leave record is not draft', () => {
    mockGetLeaveRecordByLeaveRecordId.mockReturnValue({
      isDraft: () => false,
    })

    expect(() =>
      discardLeaveRecord(aggregate, {
        actor: defaultActor,
        leaveRecordId: 'non-existent-record',
        submissionId: 'submission-123',
      }),
    ).toThrow(new LeaveRecordNotDraftError('non-existent-record'))
  })
})
