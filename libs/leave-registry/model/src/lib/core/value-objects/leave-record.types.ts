import { Entity, ExternalId } from '@payfit/common-time-model'
import { LeavePeriod, LeavePeriodHelper } from './leave-period'
import { LeaveStatus, LeaveStatusHelper } from './leave-status'
import { LeaveType } from './leave-type'

export type LeaveRecordExternalIdType = 'hashtableRowId'

export type LeaveRecordExternalId = ExternalId & {
  type: LeaveRecordExternalIdType
}

export interface ILeaveRecord {
  id: string
  from: 'absencesModel' | 'leaveRecordsModel'
  leaveType: LeaveType
  leavePeriod: LeavePeriod
  leaveStatus: LeaveStatus
  associatedExternalIds: LeaveRecordExternalId[]
}

export class LeaveRecord extends Entity {
  from: 'absencesModel' | 'leaveRecordsModel'
  leaveType: LeaveType
  leavePeriod: LeavePeriod
  leaveStatus: LeaveStatus
  associatedExternalIds: LeaveRecordExternalId[]

  constructor({
    leaveRecordId,
    from,
    leaveType,
    leavePeriod,
    leaveStatus,
    associatedExternalIds,
  }: {
    leaveRecordId: string
    from: 'absencesModel' | 'leaveRecordsModel'
    leaveType: LeaveType
    leavePeriod: LeavePeriod
    leaveStatus: LeaveStatus
    associatedExternalIds: LeaveRecordExternalId[]
  }) {
    super(leaveRecordId)
    this.from = from
    this.leaveType = leaveType
    this.leavePeriod = leavePeriod
    this.leaveStatus = leaveStatus
    this.associatedExternalIds = associatedExternalIds
  }

  public isValid(): boolean {
    return LeavePeriodHelper.isValid(this.leavePeriod)
  }

  public isOverlapping(leavePeriod: LeavePeriod): boolean {
    return LeavePeriodHelper.isOverlapping(this.leavePeriod, leavePeriod)
  }

  public isOngoing(): boolean {
    return LeaveStatusHelper.isOngoing(this.leaveStatus)
  }

  public isCancelled(): boolean {
    return this.leaveStatus.name === 'cancelled'
  }

  public isDiscarded(): boolean {
    return this.leaveStatus.name === 'discarded'
  }

  public isDismissed(): boolean {
    return this.leaveStatus.name === 'dismissed'
  }

  public isDraft(): boolean {
    return this.leaveStatus.name === 'draft'
  }

  public isRegistered(): boolean {
    return this.leaveStatus.name === 'registered'
  }

  public toJSON(): ILeaveRecord {
    return {
      id: this.id,
      from: this.from,
      leaveType: this.leaveType,
      leavePeriod: this.leavePeriod,
      leaveStatus: this.leaveStatus,
      associatedExternalIds: this.associatedExternalIds,
    }
  }

  public static fromJSON(json: ILeaveRecord): LeaveRecord {
    return new LeaveRecord({
      leaveRecordId: json.id,
      from: json.from,
      leaveType: json.leaveType,
      leavePeriod: json.leavePeriod,
      leaveStatus: json.leaveStatus,
      associatedExternalIds: json.associatedExternalIds,
    })
  }
}
