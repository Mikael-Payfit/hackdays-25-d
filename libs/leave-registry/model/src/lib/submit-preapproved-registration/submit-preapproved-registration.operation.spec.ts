import { MomentOfDay } from '@payfit/common-time-model'
import { DEFAULT_ADMIN_ACTOR } from '../../__tests__'
import { LeaveRegistryPrivateEventsEnum } from '../core/leave-registry-private-events.enum'
import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface'
import { LeaveType } from '../core/value-objects'
import { LeavePeriod } from '../core/value-objects/leave-period'
import { submitPreapprovedRegistration } from './submit-preapproved-registration.operation'

const mockApplyBeforePersist = jest.fn()
const mockRequestLeaveRecord = jest.fn()
const mockRegisterLeaveRecord = jest.fn()
const mockGetLeaveRegistryId = jest.fn()
const mockGetVersion = jest.fn().mockReturnValue(1)

const mockGenerateNewEntityId = jest.fn().mockReturnValue('mock-submission-123')

jest.mock('@payfit/common-time-model', () => ({
  ...jest.requireActual('@payfit/common-time-model'),
  generateNewEntityId: () => mockGenerateNewEntityId(),
}))

describe('PreapproveCreation', () => {
  let aggregate: ILeaveRegistryAggregate

  const defaultLeavePeriod = {
    begin: {
      date: '2021-01-01',
      moment: 'beginning-of-day' as MomentOfDay,
    },
    end: {
      date: '2021-01-02',
      moment: 'end-of-day' as MomentOfDay,
    },
  } as LeavePeriod

  const defaultLeaveType = {
    name: 'fr_conges_payes',
    country: 'FR',
  } as LeaveType

  beforeEach(() => {
    aggregate = {
      applyBeforePersist: mockApplyBeforePersist,
      requestLeaveRecord: mockRequestLeaveRecord,
      registerLeaveRecord: mockRegisterLeaveRecord,
      getLeaveRegistryId: mockGetLeaveRegistryId,
      getVersion: mockGetVersion,
    } as unknown as ILeaveRegistryAggregate

    mockRequestLeaveRecord.mockReturnValue({
      leaveRecordId: 'test-leave-record-id',
    })

    mockGetLeaveRegistryId.mockReturnValue('test-leave-registry-id')
  })

  afterEach(() => {
    mockApplyBeforePersist.mockClear()
    mockRequestLeaveRecord.mockClear()
    mockRegisterLeaveRecord.mockClear()
    mockGetLeaveRegistryId.mockClear()
    mockGenerateNewEntityId.mockClear()
  })

  it('should create new submission and leave record', () => {
    const result = submitPreapprovedRegistration(aggregate, {
      newLeavePeriod: defaultLeavePeriod,
      newLeaveType: defaultLeaveType,
      actor: DEFAULT_ADMIN_ACTOR,
    })

    expect(mockApplyBeforePersist).toHaveBeenCalledWith([
      expect.objectContaining({
        eventType: LeaveRegistryPrivateEventsEnum.REGISTRATION_PREAPPROVED,
        subjectId: 'test-leave-registry-id',
        payload: {
          submissionId: 'mock-submission-123',
          leaveRegistryId: 'test-leave-registry-id',
          leaveRegistryVersion: 1,
          actor: DEFAULT_ADMIN_ACTOR,
        },
      }),
    ])
    expect(mockRequestLeaveRecord).toHaveBeenCalledWith({
      actor: DEFAULT_ADMIN_ACTOR,
      leavePeriod: defaultLeavePeriod,
      leaveType: defaultLeaveType,
      submissionId: 'mock-submission-123',
    })
    expect(mockRegisterLeaveRecord).toHaveBeenCalledWith({
      actor: DEFAULT_ADMIN_ACTOR,
      leaveRecordId: 'test-leave-record-id',
      submissionId: 'mock-submission-123',
    })

    expect(result).toEqual({
      submissionId: 'mock-submission-123',
      leaveRecordId: 'test-leave-record-id',
    })
  })
})
