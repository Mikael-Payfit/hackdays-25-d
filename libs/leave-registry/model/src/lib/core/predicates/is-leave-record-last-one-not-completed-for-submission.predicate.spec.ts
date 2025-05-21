import {
  todayLeaveRecordDraft,
  todayLeaveRecordRegistered,
} from '../../../__tests__'
import { ILeaveRegistryAggregate } from '../leave-registry.aggregate.interface'
import { Submission } from '../value-objects'
import { isLeaveRecordLastOneNotCompletedForSubmission } from './is-leave-record-last-one-not-completed-for-submission.predicate'

const mockGetSubmission = jest.fn()
const mockGetLeaveRecordByLeaveRecordId = jest.fn()

describe('isLeaveRecordLastOneNotCompletedForSubmission', () => {
  let aggregate: ILeaveRegistryAggregate

  const submission = {
    id: 'submission-123',
    leaveRecordIds: [todayLeaveRecordDraft.id, todayLeaveRecordRegistered.id],
  } as unknown as Submission

  beforeEach(() => {
    aggregate = {
      snapshot: {
        dataStore: {
          leaveRegistryId: 'registry-123',
          leaveRecords: [],
          submissions: [],
          associatedExternalIds: [],
        },
      },
      getSubmission: mockGetSubmission,
      getLeaveRecordByLeaveRecordId: mockGetLeaveRecordByLeaveRecordId,
    } as unknown as ILeaveRegistryAggregate
  })

  describe('execute', () => {
    it('should return true when leave record is the last ongoing one in submission', () => {
      mockGetSubmission.mockReturnValue(submission)
      mockGetLeaveRecordByLeaveRecordId.mockReturnValueOnce(
        todayLeaveRecordRegistered,
      )
      mockGetLeaveRecordByLeaveRecordId.mockReturnValueOnce(
        todayLeaveRecordDraft,
      )

      expect(
        isLeaveRecordLastOneNotCompletedForSubmission(aggregate, {
          submissionId: submission.id,
          leaveRecordId: todayLeaveRecordDraft.id,
        }),
      ).toBe(true)
    })

    it('should return false when there are multiple ongoing records in submission', () => {
      mockGetSubmission.mockReturnValue(submission)
      mockGetLeaveRecordByLeaveRecordId.mockReturnValueOnce(
        todayLeaveRecordDraft,
      )
      mockGetLeaveRecordByLeaveRecordId.mockReturnValueOnce(
        todayLeaveRecordDraft,
      )

      expect(
        isLeaveRecordLastOneNotCompletedForSubmission(aggregate, {
          submissionId: submission.id,
          leaveRecordId: todayLeaveRecordDraft.id,
        }),
      ).toBe(false)
    })

    it('should return false when checking a completed record', () => {
      mockGetSubmission.mockReturnValue(submission)
      mockGetLeaveRecordByLeaveRecordId.mockReturnValue(
        todayLeaveRecordRegistered,
      )

      expect(
        isLeaveRecordLastOneNotCompletedForSubmission(aggregate, {
          submissionId: submission.id,
          leaveRecordId: todayLeaveRecordRegistered.id,
        }),
      ).toBe(false)
    })
  })
})
