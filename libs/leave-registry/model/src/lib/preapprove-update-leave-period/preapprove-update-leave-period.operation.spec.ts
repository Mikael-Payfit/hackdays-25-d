import { Actor, MomentOfDay, systemActor } from '@payfit/common-time-model'
import { LeaveRegistryPrivateEventsEnum } from '../core/leave-registry-private-events.enum'
import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface'
import { LeavePeriod } from '../core/value-objects/leave-period'
import { preapproveUpdateLeavePeriod } from './preapprove-update-leave-period.operation'

const mockGetLeaveRegistryId = jest
  .fn()
  .mockReturnValue('test-leave-registry-id')
const mockApplyBeforePersist = jest.fn()
const mockUpdateLeavePeriod = jest.fn()
const mockGetVersion = jest.fn().mockReturnValue(1)
const mockGenerateNewEntityId = jest.fn().mockReturnValue('mock-submission-123')
jest.mock('@payfit/common-time-model', () => ({
  ...jest.requireActual('@payfit/common-time-model'),
  generateNewEntityId: () => mockGenerateNewEntityId(),
}))

describe('PreapproveUpdateLeavePeriodRule', () => {
  let aggregate: ILeaveRegistryAggregate

  const defaultActor: Actor = systemActor

  beforeEach(() => {
    aggregate = {
      getLeaveRegistryId: mockGetLeaveRegistryId,
      applyBeforePersist: mockApplyBeforePersist,
      updateLeavePeriod: mockUpdateLeavePeriod,
      getVersion: mockGetVersion,
    } as unknown as ILeaveRegistryAggregate
  })

  afterEach(() => {
    mockGenerateNewEntityId.mockClear()
    mockGetLeaveRegistryId.mockClear()
    mockApplyBeforePersist.mockClear()
    mockUpdateLeavePeriod.mockClear()
  })

  it('should update a leave record and return update event', () => {
    const newLeavePeriod = {
      begin: {
        date: '2025-01-01',
        moment: 'beginning-of-day' as MomentOfDay,
      },
      end: {
        date: '2025-01-04',
        moment: 'end-of-day' as MomentOfDay,
      },
    } as LeavePeriod

    const result = preapproveUpdateLeavePeriod(aggregate, {
      actor: defaultActor,
      leaveRecordId: 'record-123',
      newLeavePeriod,
    })

    expect(result.submissionId).toEqual('mock-submission-123')
    expect(mockApplyBeforePersist).toHaveBeenCalledWith([
      expect.objectContaining({
        eventType:
          LeaveRegistryPrivateEventsEnum.UPDATE_LEAVE_PERIOD_PREAPPROVED,
        subjectId: 'test-leave-registry-id',
        payload: {
          submissionId: 'mock-submission-123',
          leaveRegistryId: 'test-leave-registry-id',
          leaveRegistryVersion: 1,
          actor: defaultActor,
        },
      }),
    ])
  })
})
