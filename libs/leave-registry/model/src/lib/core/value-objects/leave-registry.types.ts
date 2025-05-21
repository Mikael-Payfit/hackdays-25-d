import { Entity, ExternalId } from '@payfit/common-time-model'
import { ILeaveRecord, LeaveRecord } from './leave-record.types'
import { ISubmission, Submission } from './submission.types'

export type LeaveRegistryExternalIdType = 'jlContractId' | 'jlCompanyId'

export type LeaveRegistryExternalId = ExternalId & {
  type: LeaveRegistryExternalIdType
}

export interface ILeaveRegistry {
  id: string
  leaveRecords: ILeaveRecord[]
  submissions: ISubmission[]
  associatedExternalIds: LeaveRegistryExternalId[]
}

export class LeaveRegistry extends Entity implements ILeaveRegistry {
  leaveRecords: LeaveRecord[]
  submissions: Submission[]
  associatedExternalIds: LeaveRegistryExternalId[]

  constructor({
    leaveRegistryId,
    leaveRecords,
    submissions,
    associatedExternalIds,
  }: {
    leaveRegistryId: string
    leaveRecords: LeaveRecord[]
    submissions: Submission[]
    associatedExternalIds: LeaveRegistryExternalId[]
  }) {
    super(leaveRegistryId)
    this.leaveRecords = leaveRecords ?? []
    this.submissions = submissions ?? []
    this.associatedExternalIds = associatedExternalIds ?? []
  }

  public toJSON(): ILeaveRegistry {
    return {
      id: this.id,
      leaveRecords: this.leaveRecords.map((lr) => lr.toJSON()),
      submissions: this.submissions.map((s) => s.toJSON()),
      associatedExternalIds: this.associatedExternalIds,
    }
  }

  public static fromJSON(json: ILeaveRegistry): LeaveRegistry {
    return new LeaveRegistry({
      leaveRegistryId: json.id,
      leaveRecords: json.leaveRecords.map((lr) => LeaveRecord.fromJSON(lr)),
      submissions: json.submissions.map((s) => Submission.fromJSON(s)),
      associatedExternalIds: json.associatedExternalIds,
    })
  }
}

export class LeaveRegistryHelper {}
