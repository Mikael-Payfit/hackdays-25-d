import { Logger } from '@nestjs/common';
import { AggregateConsistencyError } from '@payfit/common-time-model';
import { EdpBasePayloadEvent, IEdpEvent } from '@payfit/edp-sdk';
import { applySubmissionApproved } from '../approve-submission/submission-approved.apply';
import { SubmissionApprovedEvent } from '../approve-submission/submission-approved.event';
import {
  CancelLeaveRecordInput,
  cancelLeaveRecord,
} from '../cancel-leave-record/cancel-leave-record.operation';
import { applyLeaveCancelled } from '../cancel-leave-record/leave-cancelled.apply';
import { LeaveCancelledEvent } from '../cancel-leave-record/leave-cancelled.event';
import { applySubmissionRevisionDone } from '../complet-submission-revision/submission-revision-done.apply';
import { SubmissionRevisionDoneEvent } from '../complet-submission-revision/submission-revision-done.event';
import { applySubmissionDeclined } from '../decline-submission/submission-declined.apply';
import { SubmissionDeclinedEvent } from '../decline-submission/submission-declined.event';
import {
  DiscardLeaveRecordInput,
  discardLeaveRecord,
} from '../discard-leave-record/discard-leave-record.operation';
import { applyLeaveDiscarded } from '../discard-leave-record/leave-discarded.apply';
import { LeaveDiscardedEvent } from '../discard-leave-record/leave-discarded.event';
import {
  DiscardSubmissionInput,
  discardSubmission,
} from '../discard-submission/discard-submission.operation';
import { applySubmissionDiscarded } from '../discard-submission/submission-discarded.apply';
import { SubmissionDiscardedEvent } from '../discard-submission/submission-discarded.event';
import {
  DismissLeaveRecordInput,
  dismissLeaveRecord,
} from '../dismiss-leave-record/dismiss-leave-record.operation';
import { applyLeaveDismissed } from '../dismiss-leave-record/leave-dismissed.apply';
import { LeaveDismissedEvent } from '../dismiss-leave-record/leave-dismissed.event';
import { applyCancellationPreapproved } from '../preapprove-cancellation/cancellation-preapproved.apply';
import { CancellationPreapprovedEvent } from '../preapprove-cancellation/cancellation-preapproved.event';
import {
  PreapproveCancellationInput,
  PreapproveCancellationOutput,
  preapproveCancellation,
} from '../preapprove-cancellation/preapprove-cancellation.operation';
import {
  PreapproveUpdateLeavePeriodInput,
  PreapproveUpdateLeavePeriodOutput,
  preapproveUpdateLeavePeriod,
} from '../preapprove-update-leave-period/preapprove-update-leave-period.operation';
import { applyUpdateLeavePeriodPreapproved } from '../preapprove-update-leave-period/update-leave-period-preapproved.apply';
import { UpdateLeavePeriodPreapprovedEvent } from '../preapprove-update-leave-period/update-leave-period-preapproved.event';
import { applyLeaveRegistered } from '../register-leave-record/leave-registered.apply';
import { LeaveRegisteredEvent } from '../register-leave-record/leave-registered.event';
import {
  RegisterLeaveRecordInput,
  registerLeaveRecord,
} from '../register-leave-record/register-leave-record.operation';
import { applyLeaveRequested } from '../request-leave-record/leave-requested.apply';
import { LeaveRequestedEvent } from '../request-leave-record/leave-requested.event';
import {
  RequestLeaveRecordInput,
  RequestLeaveRecordOutput,
  requestLeaveRecord,
} from '../request-leave-record/request-leave-record.operation';
import { applySubmissionRevisionRequested } from '../request-submission-revision/submission-revision-requested.apply';
import { SubmissionRevisionRequestedEvent } from '../request-submission-revision/submission-revision-requested.event';
import { applyLeaveRolledback } from '../rollback-leave-record/leave-rolledback.apply';
import { LeaveRolledbackEvent } from '../rollback-leave-record/leave-rolledback.event';
import {
  RollbackLeaveRecordInput,
  RollbackLeaveRecordOutput,
  rollbackLeaveRecord,
} from '../rollback-leave-record/rollback-leave-record.operation';
import { applyPreapprovedRegistrationSubmitted } from '../submit-preapproved-registration/preapproved-registration-submitted.apply';
import { PreapprovedRegistrationSubmittedEvent } from '../submit-preapproved-registration/preapproved-registration-submitted.event';
import {
  SubmitPreapprovedRegistrationInput,
  SubmitPreapprovedRegistrationOutput,
  submitPreapprovedRegistration,
} from '../submit-preapproved-registration/submit-preapproved-registration.operation';
import { applyLeavePeriodUpdated } from '../update-leave-period/leave-period-updated.apply';
import { LeavePeriodUpdatedEvent } from '../update-leave-period/leave-period-updated.event';
import {
  UpdateLeavePeriodInput,
  updateLeavePeriod,
} from '../update-leave-period/update-leave-period.operation';
import {
  GetLastOpenSubmissionForLeaveRecordInput,
  getLastOpenSubmissionForLeaveRecordFilter,
} from './filters/get-last-open-submissions-for-leave-record.filter';
import {
  GetOngoingOverlappingLeaveRecordsInput,
  getOngoingOverlappingLeaveRecordsFilter,
} from './filters/get-ongoing-overlapping-leave-records.filter';
import {
  GetOpenSubmissionForLeaveRecordInput,
  getOpenSubmissionForLeaveRecordFilter,
} from './filters/get-open-submissions-for-leave-record.filter';
import { LeaveRegistryPrivateEventsEnum } from './leave-registry-private-events.enum';
import { ILeaveRegistryAggregate } from './leave-registry.aggregate.interface';
import { LeaveRegistrySnapshot } from './leave-registry.snapshot';
import {
  HasExistingLeaveRecordInput,
  hasExistingLeaveRecord,
} from './predicates/has-existing-leave-record.predicate';
import {
  HasRegisteredOverlappingLeaveRecordsInput,
  hasRegisteredOverlappingLeaveRecords,
} from './predicates/has-registered-overlapping-leave-records.predicate';
import {
  IsLeaveRecordLastOneNotCompletedForSubmissionInput,
  isLeaveRecordLastOneNotCompletedForSubmission,
} from './predicates/is-leave-record-last-one-not-completed-for-submission.predicate';
import {
  ILeaveRegistry,
  LeaveRecord,
  LeaveRegistry,
  Submission,
} from './value-objects';

export class LeaveRegistryAggregate implements ILeaveRegistryAggregate {
  private hydrated = false;
  private snapshot: LeaveRegistrySnapshot | undefined;
  private toPersistEvents: IEdpEvent<EdpBasePayloadEvent>[] = [];
  private consistencyErrors: string[] = [];

  private constructor() {
    // defined to mark the constructor as private
  }

  public get isInitialized(): boolean {
    return (
      this.snapshot !== undefined && this.snapshot.getDataStore() !== undefined
    );
  }

  public isNewlyCreated = false;

  public getHistory(): IEdpEvent<EdpBasePayloadEvent>[] {
    return this.snapshot?.getAppliedEvents() ?? [];
  }

  public get isHydrated(): boolean {
    return this.hydrated;
  }

  isConsistent(): boolean {
    this.consistencyErrors = [];
    if (!this.snapshot || !this.snapshot.getDataStore()) {
      this.consistencyErrors.push('Snapshot is not initialized');
    }
    if (this.isHydrated) {
      if (this.getJLCompanyId() === undefined) {
        this.consistencyErrors.push('JLCompanyId is not defined');
      }
      if (this.getJLContractId() === undefined) {
        this.consistencyErrors.push('JLContractId is not defined');
      }
    }

    const dataStore = this.snapshot?.getDataStore();
    if (!dataStore || dataStore.id === undefined) {
      this.consistencyErrors.push('LeaveRegistryId is not defined');
    }

    return this.consistencyErrors.length === 0;
  }

  getConsistencyErrors(): string[] {
    return this.consistencyErrors;
  }

  getSnapshot(): LeaveRegistrySnapshot {
    if (!this.snapshot) {
      throw new Error('Snapshot is not initialized');
    }
    return this.snapshot;
  }

  getDataStore(): LeaveRegistry {
    if (!this.snapshot) {
      throw new Error('Data Store is not initialized');
    }
    return this.snapshot.getDataStore();
  }

  getVersion(): number {
    if (!this.snapshot || this.snapshot.getCursor() === undefined) {
      // No events apply on this aggregate. So we let the version as 0
      return 0;
    }
    // checked in the if above
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.snapshot.getCursor()!.eventTime;
  }

  getInitialState(): ILeaveRegistry {
    if (!this.snapshot) {
      throw new Error('Snapshot is not initialized');
    }
    return this.snapshot.getInitialState();
  }

  getJLCompanyId(): string {
    const jlCompanyId = this.getDataStore().associatedExternalIds.find(
      (extId) => extId.type === 'jlCompanyId'
    )?.id;
    if (!jlCompanyId) {
      throw new Error('JLCompanyId is not defined');
    }
    return jlCompanyId;
  }

  getJLContractId(): string {
    const jlContractId = this.getDataStore().associatedExternalIds.find(
      (extId) => extId.type === 'jlContractId'
    )?.id;
    if (!jlContractId) {
      throw new Error('JLContractId is not defined');
    }
    return jlContractId;
  }

  getLeaveRegistryId(): string {
    if (!this.snapshot) {
      throw new Error('Data Store is not initialized');
    }
    return this.snapshot.leaveRegistryId;
  }

  getLeaveRecordByLeaveRecordId(
    leaveRecordId: string
  ): LeaveRecord | undefined {
    return this.getDataStore().leaveRecords.find(
      (lr) => lr.id === leaveRecordId
    );
  }

  getSubmission(submissionId: string): Submission | undefined {
    return this.getDataStore().submissions.find((lr) => lr.id === submissionId);
  }

  getSubjectVersion(): string | undefined {
    return this.snapshot?.getCursor()?.versions?.subjectVersion;
  }

  getUnpersistedEvents(): IEdpEvent<EdpBasePayloadEvent>[] {
    return this.toPersistEvents;
  }

  getLeaveRecords(): LeaveRecord[] {
    return this.getDataStore().leaveRecords;
  }

  clearUnpersistedEvents(): void {
    this.toPersistEvents = [];
  }

  static newLeaveRegistry({
    leaveRegistryId,
    jlContractId,
    jlCompanyId,
    initialSnapshot,
  }: {
    leaveRegistryId: string;
    jlContractId: string;
    jlCompanyId: string;
    initialSnapshot?: ILeaveRegistry;
  }): LeaveRegistryAggregate {
    const aggregate = LeaveRegistryAggregate.hydrate({
      snapshot: new LeaveRegistrySnapshot(leaveRegistryId, initialSnapshot),
      jlContractId,
      jlCompanyId,
      events: [],
    });

    if (!aggregate.isConsistent()) {
      throw new AggregateConsistencyError([], aggregate.getConsistencyErrors());
    }

    aggregate.isNewlyCreated = true;

    return aggregate;
  }

  static hydrate({
    snapshot,
    events,
    jlContractId,
    jlCompanyId,
  }: {
    snapshot: LeaveRegistrySnapshot;
    jlCompanyId: string;
    jlContractId: string;
    events: IEdpEvent<EdpBasePayloadEvent>[];
  }): LeaveRegistryAggregate {
    const aggregate = new LeaveRegistryAggregate();
    aggregate.snapshot = snapshot;

    aggregate
      .getDataStore()
      .associatedExternalIds.push({ type: 'jlContractId', id: jlContractId });
    aggregate
      .getDataStore()
      .associatedExternalIds.push({ type: 'jlCompanyId', id: jlCompanyId });

    aggregate.applyEvents(events);

    if (!aggregate.isConsistent()) {
      throw new AggregateConsistencyError(
        events,
        aggregate.getConsistencyErrors()
      );
    }

    return aggregate;
  }

  applyBeforePersist(events: IEdpEvent<EdpBasePayloadEvent>[]) {
    this.toPersistEvents.push(...events);
    this.applyEvents(events);
    if (!this.isConsistent()) {
      throw new AggregateConsistencyError(events, this.getConsistencyErrors());
    }
  }

  applyEvents(events: IEdpEvent<EdpBasePayloadEvent>[]) {
    if (!this.isInitialized) {
      Logger.error('Data store is not initialized');
      return;
    }
    for (const event of events) {
      switch (event.eventType) {
        case LeaveRegistryPrivateEventsEnum.LEAVE_REQUESTED:
          applyLeaveRequested(this, event as LeaveRequestedEvent);
          this.snapshot?.addAppliedEvent(event);
          break;
        case LeaveRegistryPrivateEventsEnum.LEAVE_CANCELLED:
          applyLeaveCancelled(this, event as LeaveCancelledEvent);
          this.snapshot?.addAppliedEvent(event);
          break;
        case LeaveRegistryPrivateEventsEnum.LEAVE_DISCARDED:
          applyLeaveDiscarded(this, event as LeaveDiscardedEvent);
          this.snapshot?.addAppliedEvent(event);
          break;
        case LeaveRegistryPrivateEventsEnum.LEAVE_DISMISSED:
          applyLeaveDismissed(this, event as LeaveDismissedEvent);
          this.snapshot?.addAppliedEvent(event);
          break;
        case LeaveRegistryPrivateEventsEnum.LEAVE_REGISTERED:
          applyLeaveRegistered(this, event as LeaveRegisteredEvent);
          this.snapshot?.addAppliedEvent(event);
          break;
        case LeaveRegistryPrivateEventsEnum.LEAVE_ROLLEDBACK:
          applyLeaveRolledback(this, event as LeaveRolledbackEvent);
          this.snapshot?.addAppliedEvent(event);
          break;
        case LeaveRegistryPrivateEventsEnum.LEAVE_PERIOD_UPDATED:
          applyLeavePeriodUpdated(this, event as LeavePeriodUpdatedEvent);
          this.snapshot?.addAppliedEvent(event);
          break;
        case LeaveRegistryPrivateEventsEnum.REGISTRATION_PREAPPROVED:
          applyPreapprovedRegistrationSubmitted(
            this,
            event as PreapprovedRegistrationSubmittedEvent
          );
          this.snapshot?.addAppliedEvent(event);
          break;
        case LeaveRegistryPrivateEventsEnum.CANCELLATION_PREAPPROVED:
          applyCancellationPreapproved(
            this,
            event as CancellationPreapprovedEvent
          );
          this.snapshot?.addAppliedEvent(event);
          break;
        case LeaveRegistryPrivateEventsEnum.UPDATE_LEAVE_PERIOD_PREAPPROVED:
          applyUpdateLeavePeriodPreapproved(
            this,
            event as UpdateLeavePeriodPreapprovedEvent
          );
          this.snapshot?.addAppliedEvent(event);
          break;
        case LeaveRegistryPrivateEventsEnum.SUBMISSION_APPROVED:
          applySubmissionApproved(this, event as SubmissionApprovedEvent);
          this.snapshot?.addAppliedEvent(event);
          break;
        case LeaveRegistryPrivateEventsEnum.SUBMISSION_DECLINED:
          applySubmissionDeclined(this, event as SubmissionDeclinedEvent);
          this.snapshot?.addAppliedEvent(event);
          break;
        case LeaveRegistryPrivateEventsEnum.SUBMISSION_DISCARDED:
          applySubmissionDiscarded(this, event as SubmissionDiscardedEvent);
          this.snapshot?.addAppliedEvent(event);
          break;
        case LeaveRegistryPrivateEventsEnum.SUBMISSION_REVISION_DONE:
          applySubmissionRevisionDone(
            this,
            event as SubmissionRevisionDoneEvent
          );
          this.snapshot?.addAppliedEvent(event);
          break;
        case LeaveRegistryPrivateEventsEnum.SUBMISSION_REVISION_REQUESTED:
          applySubmissionRevisionRequested(
            this,
            event as SubmissionRevisionRequestedEvent
          );
          this.snapshot?.addAppliedEvent(event);
          break;
        default:
          break;
      }
    }
    if (events.length > 0) {
      this.hydrated = true;
    }
  }

  // ### FILTERS
  getLastOpenSubmissionForLeaveRecord({
    leaveRecordId,
  }: GetLastOpenSubmissionForLeaveRecordInput): Submission | undefined {
    return getLastOpenSubmissionForLeaveRecordFilter(this, {
      leaveRecordId,
    });
  }

  getOngoingOverlappingLeaveRecords({
    leavePeriod,
  }: GetOngoingOverlappingLeaveRecordsInput): LeaveRecord[] {
    return getOngoingOverlappingLeaveRecordsFilter(this, {
      leavePeriod,
    });
  }

  getOpenSubmissionsForLeaveRecord({
    leaveRecordId,
  }: GetOpenSubmissionForLeaveRecordInput): Submission[] {
    return getOpenSubmissionForLeaveRecordFilter(this, {
      leaveRecordId,
    });
  }

  // ### PREDICATES
  hasExistingLeaveRecord({
    leaveRecordId,
  }: HasExistingLeaveRecordInput): boolean {
    return hasExistingLeaveRecord(this, { leaveRecordId });
  }

  hasRegisteredOverlappingLeaveRecords({
    leavePeriod,
    excludeLeaveRecordId,
  }: HasRegisteredOverlappingLeaveRecordsInput): boolean {
    return hasRegisteredOverlappingLeaveRecords(this, {
      leavePeriod,
      excludeLeaveRecordId,
    });
  }

  isLeaveRecordLastOneNotCompletedForSubmission({
    submissionId,
    leaveRecordId,
  }: IsLeaveRecordLastOneNotCompletedForSubmissionInput): boolean {
    return isLeaveRecordLastOneNotCompletedForSubmission(this, {
      submissionId,
      leaveRecordId,
    });
  }

  // ### USE CASES
  cancelLeaveRecord({
    leaveRecordId,
    submissionId,
    actor,
  }: CancelLeaveRecordInput): void {
    return cancelLeaveRecord(this, {
      leaveRecordId,
      submissionId,
      actor,
    });
  }

  discardLeaveRecord({
    leaveRecordId,
    submissionId,
    actor,
  }: DiscardLeaveRecordInput): void {
    return discardLeaveRecord(this, {
      leaveRecordId,
      submissionId,
      actor,
    });
  }

  discardSubmission({ submissionId, actor }: DiscardSubmissionInput): void {
    return discardSubmission(this, {
      submissionId,
      actor,
    });
  }

  dismissLeaveRecord({ leaveRecordId, actor }: DismissLeaveRecordInput): void {
    return dismissLeaveRecord(this, {
      leaveRecordId,
      actor,
    });
  }

  registerLeaveRecord({
    leaveRecordId,
    submissionId,
    actor,
  }: RegisterLeaveRecordInput): void {
    return registerLeaveRecord(this, {
      leaveRecordId,
      submissionId,
      actor,
    });
  }

  requestLeaveRecord({
    leaveType,
    leavePeriod,
    submissionId,
    actor,
  }: RequestLeaveRecordInput): RequestLeaveRecordOutput {
    return requestLeaveRecord(this, {
      leaveType,
      leavePeriod,
      submissionId,
      actor,
    });
  }

  preapproveCancellation({
    leaveRecordId,
    actor,
  }: PreapproveCancellationInput): PreapproveCancellationOutput {
    return preapproveCancellation(this, {
      leaveRecordId,
      actor,
    });
  }

  preapproveUpdateLeavePeriod({
    leaveRecordId,
    newLeavePeriod,
    actor,
  }: PreapproveUpdateLeavePeriodInput): PreapproveUpdateLeavePeriodOutput {
    return preapproveUpdateLeavePeriod(this, {
      leaveRecordId,
      newLeavePeriod,
      actor,
    });
  }

  preapproveCreation({
    newLeaveType,
    newLeavePeriod,
    actor,
  }: SubmitPreapprovedRegistrationInput): SubmitPreapprovedRegistrationOutput {
    return submitPreapprovedRegistration(this, {
      newLeaveType,
      newLeavePeriod,
      actor,
    });
  }

  updateLeavePeriod({
    leaveRecordId,
    newLeavePeriod,
    submissionId,
    actor,
  }: UpdateLeavePeriodInput): void {
    return updateLeavePeriod(this, {
      leaveRecordId,
      newLeavePeriod,
      submissionId,
      actor,
    });
  }

  rollbackLeaveRecord({
    previousLeaveRecord,
    actor,
  }: RollbackLeaveRecordInput): RollbackLeaveRecordOutput {
    return rollbackLeaveRecord(this, {
      previousLeaveRecord,
      actor,
    });
  }
}
