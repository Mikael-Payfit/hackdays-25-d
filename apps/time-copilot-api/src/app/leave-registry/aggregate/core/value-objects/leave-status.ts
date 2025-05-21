type LeaveStatusName =
  | 'draft'
  | 'registered'
  | 'cancelled'
  | 'discarded'
  | 'dismissed'

export type LeaveStatus = {
  name: LeaveStatusName
}

export class LeaveStatusHelper {
  public static getDraft(): LeaveStatus {
    return { name: 'draft' }
  }

  public static getRegistered(): LeaveStatus {
    return { name: 'registered' }
  }

  public static getCancelled(): LeaveStatus {
    return { name: 'cancelled' }
  }

  public static getDiscarded(): LeaveStatus {
    return { name: 'discarded' }
  }

  public static getDismissed(): LeaveStatus {
    return { name: 'dismissed' }
  }

  public static isDraft(leaveStatus: LeaveStatus): boolean {
    return leaveStatus.name === 'draft'
  }

  public static isCancelled(leaveStatus: LeaveStatus): boolean {
    return leaveStatus.name === 'cancelled'
  }

  public static isOngoing(leaveStatus: LeaveStatus): boolean {
    return leaveStatus.name === 'draft' || leaveStatus.name === 'registered'
  }

  public static isRegistered(leaveStatus: LeaveStatus): boolean {
    return leaveStatus.name === 'registered'
  }

  public static isDiscontinued(leaveStatus: LeaveStatus): boolean {
    return leaveStatus.name === 'cancelled' || leaveStatus.name === 'discarded'
  }

  public static isEquals(
    leaveStatus1: LeaveStatus,
    leaveStatus2: LeaveStatus,
  ): boolean {
    return leaveStatus1.name === leaveStatus2.name
  }
}
