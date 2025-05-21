import { Actor, systemActor } from '@payfit/common-time-model'
import { LeaveRecordNotFoundError } from '../core/errors'
import { LeaveRegistryPrivateEventsEnum } from '../core/leave-registry-private-events.enum'
import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface'
import { dismissLeaveRecord } from './dismiss-leave-record.operation'

const mockHasExistingLeaveRecord = jest.fn().mockReturnValue(true)
const mockApplyBeforePersist = jest.fn()
const mockGetLeaveRegistryId = jest.fn().mockReturnValue('registry-123')
const mockGetVersion = jest.fn().mockReturnValue(1)

describe('DismissLeaveRecordRule', () => {
  let aggregate: ILeaveRegistryAggregate

  const defaultActor: Actor = systemActor

  beforeEach(() => {
    aggregate = {
      hasExistingLeaveRecord: mockHasExistingLeaveRecord,
      applyBeforePersist: mockApplyBeforePersist,
      getLeaveRegistryId: mockGetLeaveRegistryId,
      getVersion: mockGetVersion,
    } as unknown as ILeaveRegistryAggregate
  })

  it('should dismiss a leave record and return dismiss event', () => {
    dismissLeaveRecord(aggregate, {
      actor: defaultActor,
      leaveRecordId: 'record-123',
    })

    expect(mockApplyBeforePersist).toHaveBeenCalledWith([
      expect.objectContaining({
        eventType: LeaveRegistryPrivateEventsEnum.LEAVE_DISMISSED,
        subjectId: 'registry-123',
        payload: expect.objectContaining({
          leaveRecordId: 'record-123',
          leaveRegistryId: 'registry-123',
          leaveRegistryVersion: 1,
          actor: defaultActor,
        }),
      }),
    ])
  })

  it('should throw LeaveRecordNotFoundError when leave record does not exist', () => {
    mockHasExistingLeaveRecord.mockReturnValue(false)

    expect(() =>
      dismissLeaveRecord(aggregate, {
        actor: defaultActor,
        leaveRecordId: 'non-existent-record',
      }),
    ).toThrow(new LeaveRecordNotFoundError('non-existent-record'))
  })
})
