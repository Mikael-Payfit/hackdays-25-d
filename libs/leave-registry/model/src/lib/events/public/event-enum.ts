export enum PublicEventEnum {
  LEAVE_REGISTERED = 'hris-time.leaves.leave-registered',
  LEAVE_PERIOD_UPDATED = 'hris-time.leaves.leave-period-updated',
  LEAVE_ROLLEDBACK = 'hris-time.leaves.leave-rolledback',
  LEAVE_DISMISSED = 'hris-time.leaves.leave-dismissed',
  LEAVE_CANCELLED = 'hris-time.leaves.leave-cancelled',

  // Temp legacy events
  LEGACY_LEAVE_REGISTERED = 'hris-time.legacy-leaves.leave-registered',
  LEGACY_LEAVE_CANCELLED = 'hris-time.legacy-leaves.leave-cancelled',
  LEGACY_LEAVE_UPDATED = 'hris-time.legacy-leaves.leave-period-updated',
}
