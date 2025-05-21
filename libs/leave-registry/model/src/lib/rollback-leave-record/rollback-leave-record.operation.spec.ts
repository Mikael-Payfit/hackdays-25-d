import {
  Actor,
  ISOFormatDate,
  MomentOfDay,
  RolledbackValue,
  systemActor,
} from '@payfit/common-time-model'
import { DEFAULT_LEAVE_RECORD_ID } from '../../__tests__'
import { LeaveRecordNotFoundError } from '../core/errors'
import { LeaveRegistryPrivateEventsEnum } from '../core/leave-registry-private-events.enum'
import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface'
import { LeaveRecord } from '../core/value-objects'
import { LeaveStatusHelper } from '../core/value-objects/leave-status'
import { rollbackLeaveRecord } from './rollback-leave-record.operation'

const mockGetLeaveRegistryId = jest.fn()
const mockRollbackLeaveRecord = jest.fn()
const mockIsNewLeavePeriodValid = jest.fn()
const mockHasExistingLeaveRecord = jest.fn()
const mockHasRegisteredOverlappingLeaveRecords = jest.fn()
const mockGetLeaveRecordByLeaveRecordId = jest.fn()
const mockApplyBeforePersist = jest.fn()
const mockGetUnpersistedEvents = jest.fn()
const mockGetAggregateVersion = () => 1

describe('RollbackLeaveRecordRule', () => {
  let aggregate: ILeaveRegistryAggregate

  const defaultActor: Actor = systemActor

  const frCongesPayes = {
    name: 'fr_conges_payes',
    country: 'FR',
  }

  const defaultPreviousLeaveRecord = {
    id: DEFAULT_LEAVE_RECORD_ID,
    from: 'leaveRecordsModel',
    associatedExternalIds: [],
    leavePeriod: {
      begin: {
        date: '2025-01-01' as ISOFormatDate,
        moment: MomentOfDay.BEGINNING,
      },
      end: {
        date: '2025-01-01' as ISOFormatDate,
        moment: MomentOfDay.END,
      },
    },
    leaveStatus: LeaveStatusHelper.getDraft(),
    leaveType: frCongesPayes,
  }

  const defaultLeavePeriod = {
    begin: {
      date: '2025-01-01' as ISOFormatDate,
      moment: MomentOfDay.BEGINNING,
    },
    end: {
      date: '2025-01-03' as ISOFormatDate,
      moment: MomentOfDay.END,
    },
  }

  beforeEach(() => {
    aggregate = {
      getLeaveRegistryId: mockGetLeaveRegistryId,
      rollbackUpdateLeavePeriod: mockRollbackLeaveRecord,
      isNewLeavePeriodValid: mockIsNewLeavePeriodValid,
      hasExistingLeaveRecord: mockHasExistingLeaveRecord,
      hasRegisteredOverlappingLeaveRecords:
        mockHasRegisteredOverlappingLeaveRecords,
      getLeaveRecordByLeaveRecordId: mockGetLeaveRecordByLeaveRecordId,
      getVersion: mockGetAggregateVersion,
      applyBeforePersist: mockApplyBeforePersist,
      getUnpersistedEvents: mockGetUnpersistedEvents,
    } as unknown as ILeaveRegistryAggregate

    mockGetLeaveRegistryId.mockReturnValue('test-leave-registry-id')
    mockIsNewLeavePeriodValid.mockReturnValue(true)
    mockHasExistingLeaveRecord.mockReturnValue(true)
    mockHasRegisteredOverlappingLeaveRecords.mockReturnValue(false)
    mockGetLeaveRecordByLeaveRecordId.mockReturnValue({
      id: 'record-123',
      leavePeriod: defaultLeavePeriod,
      leaveStatus: LeaveStatusHelper.getRegistered(),
      leaveType: frCongesPayes,
    })
  })

  it('should rollback a leave record period update', () => {
    rollbackLeaveRecord(aggregate, {
      actor: defaultActor,
      previousLeaveRecord: defaultPreviousLeaveRecord as unknown as LeaveRecord,
    })

    const expectedRolledbackValues: RolledbackValue[] = []

    expectedRolledbackValues.push({
      key: 'leavePeriod',
      droppedValue: {
        begin: {
          date: defaultLeavePeriod.begin.date,
          moment: defaultLeavePeriod.begin.moment,
        },
        end: {
          date: defaultLeavePeriod.end.date,
          moment: defaultLeavePeriod.end.moment,
        },
      },
      restoredValue: {
        begin: {
          date: defaultPreviousLeaveRecord.leavePeriod.begin.date,
          moment: defaultPreviousLeaveRecord.leavePeriod.begin.moment,
        },
        end: {
          date: defaultPreviousLeaveRecord.leavePeriod.end.date,
          moment: defaultPreviousLeaveRecord.leavePeriod.end.moment,
        },
      },
    })

    expectedRolledbackValues.push({
      key: 'leaveStatus',
      droppedValue: LeaveStatusHelper.getRegistered(),
      restoredValue: LeaveStatusHelper.getDraft(),
    })

    expect(mockApplyBeforePersist).toHaveBeenCalledWith([
      expect.objectContaining({
        eventType: LeaveRegistryPrivateEventsEnum.LEAVE_ROLLEDBACK,
        subjectId: 'test-leave-registry-id',
        payload: {
          leaveRegistryId: 'test-leave-registry-id',
          actor: defaultActor,
          leaveRecordId: 'test-record-id',
          rolledbackValues: expectedRolledbackValues,
          leaveRegistryVersion: 1,
        },
      }),
    ])
  })

  it('should throw LeaveRecordNotFoundError when leave record does not exist', () => {
    mockGetLeaveRecordByLeaveRecordId.mockReturnValue(undefined)
    expect(() =>
      rollbackLeaveRecord(aggregate, {
        actor: defaultActor,
        previousLeaveRecord:
          defaultPreviousLeaveRecord as unknown as LeaveRecord,
      }),
    ).toThrow(new LeaveRecordNotFoundError('test-record-id'))
  })
})
