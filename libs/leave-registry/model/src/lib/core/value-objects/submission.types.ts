import { Actor, Entity } from '@payfit/common-time-model'
import { LeaveRecord } from './leave-record.types'

export interface ISubmission {
  id: string
  type: SubmissionTypeName
  steps: SubmissionStep[]
  leaveRecordIds: string[]
}

export class Submission extends Entity {
  type: SubmissionTypeName
  steps: SubmissionStep[]

  leaveRecordIds: string[]

  constructor({
    submissionId,
    type,
    steps,
    leaveRecordIds,
  }: {
    submissionId: string
    type: SubmissionTypeName
    steps: SubmissionStep[]
    leaveRecordIds: string[]
  }) {
    super(submissionId)
    this.type = type
    this.steps = steps
    this.leaveRecordIds = leaveRecordIds
  }

  public addLeaveRecord(leaveRecord: LeaveRecord): void {
    if (!this.hasLeaveRecordId(leaveRecord.id)) {
      this.leaveRecordIds.push(leaveRecord.id)
    }
  }

  public addStep(step: SubmissionStep): void {
    this.steps.push(step)
  }

  public addApprovalStep(actor: Actor, reason?: string): void {
    this.addStep(SubmissionStepHelper.getApprovalStep(actor, reason))
  }

  public addCompletionStep(actor: Actor, reason?: string): void {
    this.addStep(SubmissionStepHelper.getCompletionStep(actor, reason))
  }

  public addDeclinationStep(actor: Actor, reason?: string): void {
    this.addStep(SubmissionStepHelper.getDeclinationStep(actor, reason))
  }

  public addDiscardStep(actor: Actor, reason?: string): void {
    this.addStep(SubmissionStepHelper.getDiscardStep(actor, reason))
  }

  public addDismissStep(actor: Actor, reason?: string): void {
    this.addStep(SubmissionStepHelper.getDismissStep(actor, reason))
  }

  public addInitialisationStep(actor: Actor, reason?: string): void {
    this.addStep(SubmissionStepHelper.getInitialisationStep(actor, reason))
  }

  public addRevisionRequestedStep(actor: Actor, reason?: string): void {
    this.addStep(SubmissionStepHelper.getRevisionRequestedStep(actor, reason))
  }

  public addRevisionDoneStep(actor: Actor, reason?: string): void {
    this.addStep(SubmissionStepHelper.getRevisionDoneStep(actor, reason))
  }

  public addUnknownStep(actor: Actor, reason?: string): void {
    this.addStep(SubmissionStepHelper.getUnknownStep(actor, reason))
  }

  public hasLeaveRecordId(leaveRecordId: string): boolean {
    return this.leaveRecordIds.includes(leaveRecordId)
  }

  public isClosed(): boolean {
    return this.steps.some(
      (step) =>
        step.type === 'completion' ||
        step.type === 'declination' ||
        step.type === 'discard' ||
        step.type === 'dismiss',
    )
  }

  public isOpen(): boolean {
    return !this.isClosed()
  }

  public isCompleted(): boolean {
    return this.steps.some((step) => step.type === 'completion')
  }

  public isDeclined(): boolean {
    return this.steps.some((step) => step.type === 'declination')
  }

  public isDiscarded(): boolean {
    return this.steps.some((step) => step.type === 'discard')
  }

  public isDismissed(): boolean {
    return this.steps.some((step) => step.type === 'dismiss')
  }

  public toJSON(): ISubmission {
    return {
      id: this.id,
      type: this.type,
      steps: this.steps,
      leaveRecordIds: this.leaveRecordIds,
    }
  }

  public static fromJSON(json: ISubmission): Submission {
    return new Submission({
      submissionId: json.id,
      type: json.type,
      steps: json.steps,
      leaveRecordIds: json.leaveRecordIds,
    })
  }
}

export type SubmissionStepName =
  | 'approval'
  | 'completion'
  | 'declination'
  | 'discard'
  | 'dismiss'
  | 'initialisation'
  | 'revision_requested'
  | 'revision_done'
  | 'unknown'

export type SubmissionStep = {
  type: SubmissionStepName
  actor: Actor
  reason?: string
}

export class SubmissionStepHelper {
  public static getApprovalStep(actor: Actor, reason?: string): SubmissionStep {
    return {
      type: 'approval',
      actor,
      reason,
    }
  }

  public static getCompletionStep(
    actor: Actor,
    reason?: string,
  ): SubmissionStep {
    return {
      type: 'completion',
      actor,
      reason,
    }
  }

  public static getDeclinationStep(
    actor: Actor,
    reason?: string,
  ): SubmissionStep {
    return {
      type: 'declination',
      actor,
      reason,
    }
  }

  public static getDiscardStep(actor: Actor, reason?: string): SubmissionStep {
    return {
      type: 'discard',
      actor,
      reason,
    }
  }

  public static getDismissStep(actor: Actor, reason?: string): SubmissionStep {
    return {
      type: 'dismiss',
      actor,
      reason,
    }
  }

  public static getInitialisationStep(
    actor: Actor,
    reason?: string,
  ): SubmissionStep {
    return {
      type: 'initialisation',
      actor,
      reason,
    }
  }

  public static getRevisionRequestedStep(
    actor: Actor,
    reason?: string,
  ): SubmissionStep {
    return {
      type: 'revision_requested',
      actor,
      reason,
    }
  }

  public static getRevisionDoneStep(
    actor: Actor,
    reason?: string,
  ): SubmissionStep {
    return {
      type: 'revision_done',
      actor,
      reason,
    }
  }

  public static getUnknownStep(actor: Actor, reason?: string): SubmissionStep {
    return {
      type: 'unknown',
      actor,
      reason,
    }
  }

  public static isOpen(submissionStep: SubmissionStep): boolean {
    return (
      submissionStep.type !== 'completion' &&
      submissionStep.type !== 'declination' &&
      submissionStep.type !== 'discard' &&
      submissionStep.type !== 'dismiss'
    )
  }

  public static isCompleted(submissionStep: SubmissionStep): boolean {
    return submissionStep.type === 'completion'
  }

  public static isDeclined(submissionStep: SubmissionStep): boolean {
    return submissionStep.type === 'declination'
  }

  public static isDiscarded(submissionStep: SubmissionStep): boolean {
    return submissionStep.type === 'discard'
  }

  public static isDismissed(submissionStep: SubmissionStep): boolean {
    return submissionStep.type === 'dismiss'
  }
}

type SubmissionTypeName =
  | 'request_for_registration'
  | 'request_for_update_period'
  | 'request_for_cancellation'
  | 'preapproved_registration'
  | 'preapproved_update_period'
  | 'preapproved_cancellation'
  | 'unknown'

export class SubmissionTypeHelper {
  private constructor(public readonly type: SubmissionTypeName) {}

  public static registrationRequest(): SubmissionTypeName {
    return 'request_for_registration'
  }

  public static updateLeavePeriodRequest(): SubmissionTypeName {
    return 'request_for_update_period'
  }

  public static cancellationRequest(): SubmissionTypeName {
    return 'request_for_cancellation'
  }

  public static preapprovedRegistration(): SubmissionTypeName {
    return 'preapproved_registration'
  }

  public static preapprovedLeavePeriodUpdate(): SubmissionTypeName {
    return 'preapproved_update_period'
  }

  public static preapprovedCancellation(): SubmissionTypeName {
    return 'preapproved_cancellation'
  }

  public static unknown(): SubmissionTypeName {
    return 'unknown'
  }

  public static equals(
    submissionType1: SubmissionTypeName,
    submissionType2: SubmissionTypeName,
  ): boolean {
    return submissionType1 === submissionType2
  }
}
