import {
  DEFAULT_ADMIN_ACTOR,
  DEFAULT_EMPLOYEE_ACTOR,
  DEFAULT_JL_COMPANY_ID,
  DEFAULT_JL_CONTRACT_ID,
  DEFAULT_LEAVE_RECORD_ID,
  DEFAULT_MANAGER_ACTOR,
  DEFAULT_REGISTRY_ID,
  DEFAULT_SUBMISSION_ID,
} from '../../__tests__/defaults'
import { GlobalLeaveType } from './value-objects/leave-type'

import { CountryCode, MomentOfDay } from '@payfit/common-time-model'
import { ISOFormatDate } from '@payfit/data-layer-driver'
import { EdpClientTestUtils } from '@payfit/edp-client'
import {
  leaveCancelledEventFixture,
  leaveDiscardedEventFixture,
  leavePeriodUpdatedEventFixture,
  leaveRegisteredEventFixture,
  leaveRequestedEventFixture,
  preapprovedRegistrationSubmittedEventFixture,
  submissionApprovedEventFixture,
  submissionDeclinedEventFixture,
  submissionDiscardedEventFixture,
  submissionRevisionDoneEventFixture,
  submissionRevisionRequestedEventFixture,
  updateLeavePeriodPreapprovedEventFixture,
} from '../../__tests__'
import { LeaveRegistryAggregate } from './leave-registry.aggregate'
import { LeaveRegistrySnapshot } from './leave-registry.snapshot'
import { LeaveStatusHelper, SubmissionStepHelper } from './value-objects'

describe('LeaveRegistryAggregate', () => {
  let aggregate: LeaveRegistryAggregate

  EdpClientTestUtils.setEdpMetadatasForTest()

  beforeEach(() => {
    aggregate = LeaveRegistryAggregate.hydrate({
      snapshot: new LeaveRegistrySnapshot(DEFAULT_REGISTRY_ID),
      jlCompanyId: DEFAULT_JL_COMPANY_ID,
      jlContractId: DEFAULT_JL_CONTRACT_ID,
      events: [],
    })
  })

  it('should be defined', () => {
    expect(aggregate).toBeDefined()
  })

  it('should be consistent with leaveRequested event', () => {
    const aggregate = LeaveRegistryAggregate.hydrate({
      snapshot: new LeaveRegistrySnapshot(DEFAULT_REGISTRY_ID),
      jlCompanyId: DEFAULT_JL_COMPANY_ID,
      jlContractId: DEFAULT_JL_CONTRACT_ID,
      events: [
        {
          ...leaveRequestedEventFixture,
        },
      ],
    })
    expect(aggregate.isConsistent()).toBe(true)
    expect(aggregate.getDataStore().toJSON()).toEqual(
      expect.objectContaining({
        id: DEFAULT_REGISTRY_ID,
        leaveRecords: [
          expect.objectContaining({
            id: DEFAULT_LEAVE_RECORD_ID,
            leaveType: {
              name: leaveRequestedEventFixture.payload.type as GlobalLeaveType,
              country: leaveRequestedEventFixture.payload
                .country as CountryCode,
            },
            leavePeriod: {
              begin: {
                date: leaveRequestedEventFixture.payload
                  .beginDate as ISOFormatDate,
                moment: leaveRequestedEventFixture.payload
                  .beginMoment as MomentOfDay,
              },
              end: {
                date: leaveRequestedEventFixture.payload
                  .endDate as ISOFormatDate,
                moment: leaveRequestedEventFixture.payload
                  .endMoment as MomentOfDay,
              },
            },
            leaveStatus: LeaveStatusHelper.getDraft(),
            associatedExternalIds: [],
          }),
        ],
      }),
    )
  })

  it('should update the aggregate when adding leaveCancelledEvent', () => {
    const aggregate = LeaveRegistryAggregate.hydrate({
      snapshot: new LeaveRegistrySnapshot(DEFAULT_REGISTRY_ID),
      jlCompanyId: DEFAULT_JL_COMPANY_ID,
      jlContractId: DEFAULT_JL_CONTRACT_ID,
      events: [
        {
          ...leaveRequestedEventFixture,
        },
        {
          ...leaveCancelledEventFixture,
        },
      ],
    })

    expect(aggregate.isConsistent()).toBe(true)
    expect(aggregate.getDataStore().leaveRecords.length).toEqual(1)
    expect(aggregate.getDataStore().leaveRecords[0].leaveStatus).toEqual(
      LeaveStatusHelper.getCancelled(),
    )
  })

  it('should update the aggregate when adding leaveRegisteredEvent', () => {
    const aggregate = LeaveRegistryAggregate.hydrate({
      snapshot: new LeaveRegistrySnapshot(DEFAULT_REGISTRY_ID),
      jlCompanyId: DEFAULT_JL_COMPANY_ID,
      jlContractId: DEFAULT_JL_CONTRACT_ID,
      events: [
        {
          ...leaveRequestedEventFixture,
        },
        {
          ...leaveRegisteredEventFixture,
        },
      ],
    })

    expect(aggregate.isConsistent()).toBe(true)
    expect(aggregate.getDataStore().leaveRecords.length).toEqual(1)
    expect(aggregate.getDataStore().leaveRecords[0]).toEqual(
      expect.objectContaining({
        leaveStatus: LeaveStatusHelper.getRegistered(),
      }),
    )
  })

  it('should update the aggregate when adding leavePeriodUpdatedEvent', () => {
    const aggregate = LeaveRegistryAggregate.hydrate({
      snapshot: new LeaveRegistrySnapshot(DEFAULT_REGISTRY_ID),
      jlCompanyId: DEFAULT_JL_COMPANY_ID,
      jlContractId: DEFAULT_JL_CONTRACT_ID,
      events: [
        {
          ...leaveRequestedEventFixture,
        },
        {
          ...leavePeriodUpdatedEventFixture,
        },
      ],
    })

    expect(aggregate.isConsistent()).toBe(true)
    expect(aggregate.getDataStore().leaveRecords.length).toEqual(1)
    expect(aggregate.getDataStore().leaveRecords[0]).toEqual(
      expect.objectContaining({
        leavePeriod: {
          begin: {
            date: leavePeriodUpdatedEventFixture.payload
              .newBeginDate as ISOFormatDate,
            moment: leavePeriodUpdatedEventFixture.payload
              .newBeginMoment as MomentOfDay,
          },
          end: {
            date: leavePeriodUpdatedEventFixture.payload
              .newEndDate as ISOFormatDate,
            moment: leavePeriodUpdatedEventFixture.payload
              .newEndMoment as MomentOfDay,
          },
        },
      }),
    )
  })

  it('should correctly identify overlapping leaves', () => {
    const aggregate = LeaveRegistryAggregate.hydrate({
      snapshot: new LeaveRegistrySnapshot(DEFAULT_REGISTRY_ID),
      jlCompanyId: DEFAULT_JL_COMPANY_ID,
      jlContractId: DEFAULT_JL_CONTRACT_ID,
      events: [
        {
          ...leaveRequestedEventFixture,
          payload: {
            ...leaveRequestedEventFixture.payload,
            beginDate: '2023-07-01',
            endDate: '2023-07-10',
            leaveRecordId: '1',
          },
        },
        {
          ...leaveRegisteredEventFixture,
          payload: {
            ...leaveRegisteredEventFixture.payload,
            leaveRecordId: '1',
          },
        },
        {
          ...leaveRequestedEventFixture,
          payload: {
            ...leaveRequestedEventFixture.payload,
            beginDate: '2023-07-21',
            endDate: '2023-07-25',
            leaveRecordId: '2',
          },
        },
        {
          ...leaveRegisteredEventFixture,
          payload: {
            ...leaveRegisteredEventFixture.payload,
            leaveRecordId: '2',
          },
        },
      ],
    })

    const overlappingPeriod = {
      begin: {
        date: '2023-07-05' as ISOFormatDate,
        moment: 'beginning-of-day' as MomentOfDay,
      },
      end: {
        date: '2023-07-20' as ISOFormatDate,
        moment: 'end-of-day' as MomentOfDay,
      },
    }

    const overlappingLeaves = aggregate.getOngoingOverlappingLeaveRecords({
      leavePeriod: overlappingPeriod,
    })

    expect(overlappingLeaves.length).toBe(1)
    expect(overlappingLeaves[0].id).toBe('1')

    const nonOverlappingPeriod = {
      begin: {
        date: '2023-08-01' as ISOFormatDate,
        moment: 'beginning-of-day' as MomentOfDay,
      },
      end: {
        date: '2023-08-10' as ISOFormatDate,
        moment: 'end-of-day' as MomentOfDay,
      },
    }

    const nonOverlappingLeaves = aggregate.getOngoingOverlappingLeaveRecords({
      leavePeriod: nonOverlappingPeriod,
    })

    expect(nonOverlappingLeaves.length).toBe(0)
  })

  describe('submissions', () => {
    it('should be consistent with validationRequestSubmitted event', () => {
      aggregate.applyEvents([preapprovedRegistrationSubmittedEventFixture])
      expect(aggregate.isConsistent()).toBe(true)
      expect(aggregate.getDataStore()).toEqual(
        expect.objectContaining({
          submissions: [
            {
              id: DEFAULT_SUBMISSION_ID,
              steps: [
                SubmissionStepHelper.getInitialisationStep(
                  DEFAULT_ADMIN_ACTOR,
                  'Preapproved Registration Submitted',
                ),
                SubmissionStepHelper.getApprovalStep(
                  DEFAULT_ADMIN_ACTOR,
                  'Preapproved Registration Submitted',
                ),
                SubmissionStepHelper.getCompletionStep(
                  DEFAULT_ADMIN_ACTOR,
                  'Preapproved Registration Submitted',
                ),
              ],
              leaveRecordIds: [],
              type: 'preapproved_registration',
            },
          ],
        }),
      )
    })

    it('should update the aggregate when adding leaveRequestedEvent', () => {
      aggregate.applyEvents([
        preapprovedRegistrationSubmittedEventFixture,
        leaveRequestedEventFixture,
      ])

      expect(aggregate.isConsistent()).toBe(true)
      expect(
        aggregate.getSubmission(DEFAULT_SUBMISSION_ID)?.leaveRecordIds.length,
      ).toEqual(1)
      expect(
        aggregate.getSubmission(DEFAULT_SUBMISSION_ID)?.leaveRecordIds,
      ).toContain('test-record-id')
    })

    it('should update the aggregate when adding leaveDiscardedEvent', () => {
      aggregate.applyEvents([
        preapprovedRegistrationSubmittedEventFixture,
        leaveRequestedEventFixture,
        leaveDiscardedEventFixture,
      ])

      expect(aggregate.isConsistent()).toBe(true)
      expect(
        aggregate.getSubmission(DEFAULT_SUBMISSION_ID)?.leaveRecordIds.length,
      ).toEqual(1)
    })

    it('should update the aggregate when adding submissionApprovedEvent', () => {
      aggregate.applyEvents([
        preapprovedRegistrationSubmittedEventFixture,
        submissionApprovedEventFixture,
      ])

      expect(aggregate.isConsistent()).toBe(true)
      expect(
        aggregate.getSubmission(DEFAULT_SUBMISSION_ID)?.steps,
      ).toContainEqual(
        SubmissionStepHelper.getApprovalStep(
          DEFAULT_ADMIN_ACTOR,
          'Preapproved Registration Submitted',
        ),
      )
      expect(
        aggregate.getSubmission(DEFAULT_SUBMISSION_ID)?.steps,
      ).toContainEqual(
        SubmissionStepHelper.getCompletionStep(
          DEFAULT_ADMIN_ACTOR,
          'Has been manually approved',
        ),
      )
    })

    it('should update the aggregate when adding submissionDeclinedEvent', () => {
      aggregate.applyEvents([
        preapprovedRegistrationSubmittedEventFixture,
        submissionDeclinedEventFixture,
      ])

      expect(aggregate.isConsistent()).toBe(true)
      expect(
        aggregate.getSubmission(DEFAULT_SUBMISSION_ID)?.steps,
      ).toContainEqual(
        SubmissionStepHelper.getDeclinationStep(
          DEFAULT_MANAGER_ACTOR,
          'Has been manually declined',
        ),
      )
    })

    it('should update the aggregate when adding submissionRevisionRequestedEvent', () => {
      aggregate.applyEvents([
        preapprovedRegistrationSubmittedEventFixture,
        submissionRevisionRequestedEventFixture,
      ])

      expect(aggregate.isConsistent()).toBe(true)
      expect(
        aggregate.getSubmission(DEFAULT_SUBMISSION_ID)?.steps,
      ).toContainEqual(
        SubmissionStepHelper.getRevisionRequestedStep(DEFAULT_MANAGER_ACTOR),
      )
    })

    it('should update the aggregate when adding submissionRevisionDoneEvent', () => {
      aggregate.applyEvents([
        preapprovedRegistrationSubmittedEventFixture,
        submissionRevisionRequestedEventFixture,
        submissionRevisionDoneEventFixture,
      ])

      expect(aggregate.isConsistent()).toBe(true)
      expect(
        aggregate.getSubmission(DEFAULT_SUBMISSION_ID)?.steps,
      ).toContainEqual(
        SubmissionStepHelper.getRevisionDoneStep(
          DEFAULT_EMPLOYEE_ACTOR,
          'Has been manually approved',
        ),
      )
    })

    it('should update the aggregate when adding preapprovedRegistrationSubmittedEvent', () => {
      aggregate.applyEvents([preapprovedRegistrationSubmittedEventFixture])

      expect(aggregate.isConsistent()).toBe(true)
      expect(aggregate.getSubmission(DEFAULT_SUBMISSION_ID)).toEqual(
        expect.objectContaining({
          id: DEFAULT_SUBMISSION_ID,
          type: 'preapproved_registration',
          steps: [
            SubmissionStepHelper.getInitialisationStep(
              DEFAULT_ADMIN_ACTOR,
              'Preapproved Registration Submitted',
            ),
            SubmissionStepHelper.getApprovalStep(
              DEFAULT_ADMIN_ACTOR,
              'Preapproved Registration Submitted',
            ),
            SubmissionStepHelper.getCompletionStep(
              DEFAULT_ADMIN_ACTOR,
              'Preapproved Registration Submitted',
            ),
          ],
          leaveRecordIds: [],
        }),
      )
    })

    it('should update the aggregate when adding submissionDiscardedEvent', () => {
      aggregate.applyEvents([
        preapprovedRegistrationSubmittedEventFixture,
        submissionDiscardedEventFixture,
      ])

      expect(aggregate.isConsistent()).toBe(true)
      expect(
        aggregate.getSubmission(DEFAULT_SUBMISSION_ID)?.steps,
      ).toContainEqual(
        SubmissionStepHelper.getDiscardStep(
          DEFAULT_ADMIN_ACTOR,
          'Has been manually discarded',
        ),
      )
      expect(
        aggregate.getSubmission(DEFAULT_SUBMISSION_ID)?.steps,
      ).toContainEqual(
        SubmissionStepHelper.getCompletionStep(
          DEFAULT_ADMIN_ACTOR,
          'Has been manually discarded',
        ),
      )
    })

    it('should update the aggregate when adding updateLeavePeriodPreapprovedEvent', () => {
      aggregate.applyEvents([updateLeavePeriodPreapprovedEventFixture])

      expect(aggregate.isConsistent()).toBe(true)
      expect(aggregate.getSubmission(DEFAULT_SUBMISSION_ID)).toEqual(
        expect.objectContaining({
          id: DEFAULT_SUBMISSION_ID,
          type: 'preapproved_update_period',
          steps: [
            SubmissionStepHelper.getInitialisationStep(
              DEFAULT_ADMIN_ACTOR,
              'Preapproved Update Period',
            ),
            SubmissionStepHelper.getApprovalStep(
              DEFAULT_ADMIN_ACTOR,
              'Preapproved Update Period',
            ),
            SubmissionStepHelper.getCompletionStep(
              DEFAULT_ADMIN_ACTOR,
              'Preapproved Update Period',
            ),
          ],
          leaveRecordIds: [],
        }),
      )
    })
  })
})
