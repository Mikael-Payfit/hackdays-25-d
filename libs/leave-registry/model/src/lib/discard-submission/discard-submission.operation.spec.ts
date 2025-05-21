import { Actor, systemActor } from '@payfit/common-time-model'
import { SubmissionNotFoundError, SubmissionNotOpenError } from '../core/errors'
import { LeaveRegistryPrivateEventsEnum } from '../core/leave-registry-private-events.enum'
import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface'
import {
  Submission,
  SubmissionStepHelper,
  SubmissionTypeHelper,
} from '../core/value-objects'
import { discardSubmission } from './discard-submission.operation'

const mockApplyBeforePersist = jest.fn()
const mockGetLeaveRegistryId = jest.fn().mockReturnValue('registry-123')
const mockGetSubmission = jest.fn()
const mockGetVersion = jest.fn().mockReturnValue(1)

describe('DiscardSubmissionRule', () => {
  let aggregate: ILeaveRegistryAggregate

  const defaultActor: Actor = systemActor

  const defaultSubmission = new Submission({
    submissionId: 'submission-123',
    type: SubmissionTypeHelper.registrationRequest(),
    steps: [
      SubmissionStepHelper.getInitialisationStep(
        defaultActor,
        'Initialisation',
      ),
    ],
    leaveRecordIds: ['record-123'],
  })

  beforeEach(() => {
    aggregate = {
      getSubmission: mockGetSubmission,
      applyBeforePersist: mockApplyBeforePersist,
      getLeaveRegistryId: mockGetLeaveRegistryId,
      getVersion: mockGetVersion,
    } as unknown as ILeaveRegistryAggregate

    mockGetSubmission.mockReturnValue(defaultSubmission)
    mockGetLeaveRegistryId.mockReturnValue('registry-123')
  })

  afterEach(() => {
    mockGetSubmission.mockClear()
    mockApplyBeforePersist.mockClear()
    mockGetLeaveRegistryId.mockClear()
  })

  it('should discard a submission and return discard event', () => {
    jest.spyOn(defaultSubmission, 'isCompleted').mockReturnValue(false)

    discardSubmission(aggregate, {
      actor: defaultActor,
      submissionId: 'submission-123',
    })

    expect(mockApplyBeforePersist).toHaveBeenCalledWith([
      expect.objectContaining({
        eventType: LeaveRegistryPrivateEventsEnum.SUBMISSION_DISCARDED,
        subjectId: 'registry-123',
        payload: expect.objectContaining({
          submissionId: 'submission-123',
          leaveRegistryId: 'registry-123',
          leaveRegistryVersion: 1,
          actor: defaultActor,
        }),
      }),
    ])
  })

  it('should throw SubmissionNotFoundError when submission does not exist', () => {
    mockGetSubmission.mockReturnValue(null)

    expect(() =>
      discardSubmission(aggregate, {
        actor: defaultActor,
        submissionId: 'non-existent-submission',
      }),
    ).toThrow(new SubmissionNotFoundError('non-existent-submission'))
  })

  it('should throw SubmissionNotOpenError when submission is completed', () => {
    jest.spyOn(defaultSubmission, 'isCompleted').mockReturnValue(true)

    expect(() =>
      discardSubmission(aggregate, {
        actor: defaultActor,
        submissionId: 'submission-123',
      }),
    ).toThrow(new SubmissionNotOpenError('submission-123'))
  })
})
