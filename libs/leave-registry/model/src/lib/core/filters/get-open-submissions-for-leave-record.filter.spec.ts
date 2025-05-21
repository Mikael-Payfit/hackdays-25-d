import { systemActor } from '@payfit/common-time-model'
import { ILeaveRegistryAggregate } from '../leave-registry.aggregate.interface'
import { Submission, SubmissionTypeHelper } from '../value-objects'
import { getOpenSubmissionForLeaveRecordFilter } from './get-open-submissions-for-leave-record.filter'

const mockIsSubmissionOpen = jest.fn()
const mockGetDataStore = jest.fn().mockReturnValue({
  submissions: [],
})

describe('GetOpenSubmissionForLeaveRecordRule', () => {
  let aggregate: ILeaveRegistryAggregate

  beforeEach(() => {
    aggregate = {
      isSubmissionOpen: mockIsSubmissionOpen,
      getDataStore: mockGetDataStore,
    } as unknown as ILeaveRegistryAggregate
  })

  afterEach(() => {
    mockIsSubmissionOpen.mockClear()
  })

  it('should return empty array when no submissions exist', () => {
    const result = getOpenSubmissionForLeaveRecordFilter(aggregate, {
      leaveRecordId: 'record-123',
    })

    expect(result).toEqual([])
  })

  it('should return only open submissions for the given leave record', () => {
    const openSubmission: Submission = new Submission({
      submissionId: 'submission-1',
      type: SubmissionTypeHelper.registrationRequest(),
      steps: [],
      leaveRecordIds: ['record-123'],
    })

    const closedSubmission: Submission = new Submission({
      submissionId: 'submission-2',
      type: SubmissionTypeHelper.registrationRequest(),
      steps: [],
      leaveRecordIds: ['record-123'],
    })
    closedSubmission.addCompletionStep(systemActor)

    const otherOpenSubmission: Submission = new Submission({
      submissionId: 'submission-3',
      type: SubmissionTypeHelper.registrationRequest(),
      steps: [],
      leaveRecordIds: ['other-record'],
    })

    mockGetDataStore.mockReturnValue({
      submissions: [openSubmission, closedSubmission, otherOpenSubmission],
    })

    const result = getOpenSubmissionForLeaveRecordFilter(aggregate, {
      leaveRecordId: 'record-123',
    })

    expect(result).toEqual([openSubmission])
  })

  it('should handle submissions with empty leaveRecordIds', () => {
    const submission: Submission = new Submission({
      submissionId: 'submission-1',
      type: SubmissionTypeHelper.registrationRequest(),
      steps: [],
      leaveRecordIds: [],
    })

    mockGetDataStore.mockReturnValue({
      submissions: [submission],
    })

    mockIsSubmissionOpen.mockReturnValue(true)

    const result = getOpenSubmissionForLeaveRecordFilter(aggregate, {
      leaveRecordId: 'record-123',
    })

    expect(result).toEqual([])
  })

  it('should filter out closed submissions', () => {
    const submission: Submission = new Submission({
      submissionId: 'submission-1',
      type: SubmissionTypeHelper.registrationRequest(),
      steps: [],
      leaveRecordIds: ['record-123'],
    })
    submission.addCompletionStep(systemActor)

    mockGetDataStore.mockReturnValue({
      submissions: [submission],
    })

    mockIsSubmissionOpen.mockReturnValue(false)

    const result = getOpenSubmissionForLeaveRecordFilter(aggregate, {
      leaveRecordId: 'record-123',
    })

    expect(result).toEqual([])
  })
})
