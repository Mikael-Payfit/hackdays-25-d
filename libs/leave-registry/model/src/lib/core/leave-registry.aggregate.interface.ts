import { IEdpEvent } from '@payfit/edp-models'
import { EdpBasePayloadEvent } from '@payfit/edp-sdk'
import { CancelLeaveRecordInput } from '../cancel-leave-record/cancel-leave-record.operation'
import { DiscardLeaveRecordInput } from '../discard-leave-record/discard-leave-record.operation'
import { DiscardSubmissionInput } from '../discard-submission/discard-submission.operation'
import { DismissLeaveRecordInput } from '../dismiss-leave-record/dismiss-leave-record.operation'
import {
  PreapproveCancellationInput,
  PreapproveCancellationOutput,
} from '../preapprove-cancellation/preapprove-cancellation.operation'
import {
  PreapproveUpdateLeavePeriodInput,
  PreapproveUpdateLeavePeriodOutput,
} from '../preapprove-update-leave-period/preapprove-update-leave-period.operation'
import { RegisterLeaveRecordInput } from '../register-leave-record/register-leave-record.operation'
import {
  RequestLeaveRecordInput,
  RequestLeaveRecordOutput,
} from '../request-leave-record/request-leave-record.operation'
import { RollbackLeaveRecordInput } from '../rollback-leave-record/rollback-leave-record.operation'
import {
  SubmitPreapprovedRegistrationInput,
  SubmitPreapprovedRegistrationOutput,
} from '../submit-preapproved-registration/submit-preapproved-registration.operation'
import { UpdateLeavePeriodInput } from '../update-leave-period/update-leave-period.operation'
import { GetLastOpenSubmissionForLeaveRecordInput } from './filters/get-last-open-submissions-for-leave-record.filter'
import { GetOngoingOverlappingLeaveRecordsInput } from './filters/get-ongoing-overlapping-leave-records.filter'
import { GetOpenSubmissionForLeaveRecordInput } from './filters/get-open-submissions-for-leave-record.filter'
import { LeaveRegistrySnapshot } from './leave-registry.snapshot'
import { HasExistingLeaveRecordInput } from './predicates/has-existing-leave-record.predicate'
import { HasRegisteredOverlappingLeaveRecordsInput } from './predicates/has-registered-overlapping-leave-records.predicate'
import { IsLeaveRecordLastOneNotCompletedForSubmissionInput } from './predicates/is-leave-record-last-one-not-completed-for-submission.predicate'
import {
  ILeaveRegistry,
  LeaveRecord,
  LeaveRegistry,
  Submission,
} from './value-objects'

export interface ILeaveRegistryAggregate {
  get isInitialized(): boolean
  isNewlyCreated: boolean
  get isHydrated(): boolean

  isConsistent(): boolean
  getConsistencyErrors(): string[]
  getSnapshot(): LeaveRegistrySnapshot
  getDataStore(): LeaveRegistry
  getVersion(): number

  getInitialState(): ILeaveRegistry

  getJLCompanyId(): string
  getJLContractId(): string

  getLeaveRegistryId(): string

  getLeaveRecordByLeaveRecordId(leaveRecordId: string): LeaveRecord | undefined
  getSubmission(submissionId: string): Submission | undefined
  getSubjectVersion(): string | undefined
  getLeaveRecords(): LeaveRecord[]

  applyEvents(events: IEdpEvent<EdpBasePayloadEvent>[]): void
  applyBeforePersist(events: IEdpEvent<EdpBasePayloadEvent>[]): void
  getUnpersistedEvents(): IEdpEvent<EdpBasePayloadEvent>[]
  clearUnpersistedEvents(): void

  // ### FILTERS
  getLastOpenSubmissionForLeaveRecord({
    leaveRecordId,
  }: GetLastOpenSubmissionForLeaveRecordInput): Submission | undefined

  getOngoingOverlappingLeaveRecords({
    leavePeriod,
  }: GetOngoingOverlappingLeaveRecordsInput): LeaveRecord[]

  getOpenSubmissionsForLeaveRecord({
    leaveRecordId,
  }: GetOpenSubmissionForLeaveRecordInput): Submission[]

  // ### PREDICATES
  hasExistingLeaveRecord({
    leaveRecordId,
  }: HasExistingLeaveRecordInput): boolean

  hasRegisteredOverlappingLeaveRecords({
    leavePeriod,
    excludeLeaveRecordId,
  }: HasRegisteredOverlappingLeaveRecordsInput): boolean

  isLeaveRecordLastOneNotCompletedForSubmission({
    submissionId,
    leaveRecordId,
  }: IsLeaveRecordLastOneNotCompletedForSubmissionInput): boolean

  // ### USE CASES
  cancelLeaveRecord({
    leaveRecordId,
    submissionId,
    actor,
  }: CancelLeaveRecordInput): void

  discardLeaveRecord({
    leaveRecordId,
    submissionId,
    actor,
  }: DiscardLeaveRecordInput): void

  discardSubmission({ submissionId, actor }: DiscardSubmissionInput): void

  dismissLeaveRecord({ leaveRecordId, actor }: DismissLeaveRecordInput): void

  registerLeaveRecord({
    leaveRecordId,
    submissionId,
    actor,
  }: RegisterLeaveRecordInput): void

  requestLeaveRecord({
    leaveType,
    leavePeriod,
    submissionId,
    actor,
  }: RequestLeaveRecordInput): RequestLeaveRecordOutput

  preapproveCancellation({
    leaveRecordId,
    actor,
  }: PreapproveCancellationInput): PreapproveCancellationOutput

  preapproveUpdateLeavePeriod({
    newLeavePeriod,
    leaveRecordId,
    actor,
  }: PreapproveUpdateLeavePeriodInput): PreapproveUpdateLeavePeriodOutput

  preapproveCreation({
    newLeaveType,
    newLeavePeriod,
    actor,
  }: SubmitPreapprovedRegistrationInput): SubmitPreapprovedRegistrationOutput

  updateLeavePeriod({
    leaveRecordId,
    submissionId,
    actor,
    newLeavePeriod,
  }: UpdateLeavePeriodInput): void

  rollbackLeaveRecord({
    previousLeaveRecord,
    actor,
  }: RollbackLeaveRecordInput): void
}
