import { Actor, systemActor } from '@payfit/common-time-model'

import { todayLeaveRecordDraft } from '../../__tests__/fixtures/value-objects'
import {
  LeaveRecordCantBeRegisteredError,
  LeaveRecordNotFoundError,
} from '../core/errors'
import { LeaveRegistryPrivateEventsEnum } from '../core/leave-registry-private-events.enum'
import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface'
import { registerLeaveRecord } from './register-leave-record.operation'

const mockGetLeaveRecordByLeaveRecordId = jest.fn()
const mockApplyBeforePersist = jest.fn()
const mockGetLeaveRegistryId = jest.fn().mockReturnValue('registry-123')
const mockGetVersion = jest.fn().mockReturnValue(1)

describe('RegisterLeaveRecordRule', () => {
  let aggregate: ILeaveRegistryAggregate

  const defaultActor: Actor = systemActor

  beforeEach(() => {
    mockGetLeaveRecordByLeaveRecordId.mockReturnValue(todayLeaveRecordDraft)

    aggregate = {
      getLeaveRecordByLeaveRecordId: mockGetLeaveRecordByLeaveRecordId,
      applyBeforePersist: mockApplyBeforePersist,
      getLeaveRegistryId: mockGetLeaveRegistryId,
      getVersion: mockGetVersion,
    } as unknown as ILeaveRegistryAggregate
  })

  it('should register a leave record and return register event', () => {
    registerLeaveRecord(aggregate, {
      actor: defaultActor,
      leaveRecordId: 'record-123',
      submissionId: 'submission-123',
    })

    expect(mockApplyBeforePersist).toHaveBeenCalledWith([
      expect.objectContaining({
        eventType: LeaveRegistryPrivateEventsEnum.LEAVE_REGISTERED,
        subjectId: 'registry-123',
        payload: {
          leaveRecordId: 'record-123',
          submissionId: 'submission-123',
          leaveRegistryId: 'registry-123',
          actor: defaultActor,
          leaveRegistryVersion: 1,
        },
      }),
    ])
  })

  it('should throw LeaveRecordNotFoundError when leave record does not exist', () => {
    mockGetLeaveRecordByLeaveRecordId.mockReturnValue(undefined)

    expect(() =>
      registerLeaveRecord(aggregate, {
        actor: defaultActor,
        leaveRecordId: 'non-existent-record',
        submissionId: 'submission-123',
      }),
    ).toThrow(new LeaveRecordNotFoundError('non-existent-record'))
  })

  it('should throw LeaveRecordCantBeRegisteredError when leave record is not draft', () => {
    const nonDraftLeaveRecord = {
      leaveRecordId: 'record-123',
      isDraft: () => false,
    }
    mockGetLeaveRecordByLeaveRecordId.mockReturnValue(nonDraftLeaveRecord)

    expect(() =>
      registerLeaveRecord(aggregate, {
        actor: defaultActor,
        leaveRecordId: 'record-123',
        submissionId: 'submission-123',
      }),
    ).toThrow(new LeaveRecordCantBeRegisteredError('record-123'))
  })
})
