import { IHRISTimeManagementLeaveCancelledEvent } from './leave-cancelled.event'
import { IHRISTimeManagementLeaveDismissedEvent } from './leave-dismissed.event'
import { IHRISTimeManagementLeavePeriodUpdatedEvent } from './leave-period-updated.event'
import { IHRISTimeManagementLeaveRegisteredEvent } from './leave-registered.event'
import { IHRISTimeManagementLeaveRolledbackEvent } from './leave-rolledback.event'
import { ILegacyLeaveCancelledEvent } from './legacy-leave-cancelled.event'
import { ILegacyLeaveRegisteredEvent } from './legacy-leave-registered.event'
import { ILegacyLeaveUpdatedEvent } from './legacy-leave-updated.event'

export * from './event-enum'
export * from './leave-cancelled.event'
export * from './leave-dismissed.event'
export * from './leave-period-updated.event'
export * from './leave-registered.event'
export * from './leave-rolledback.event'
export * from './legacy-leave-cancelled.event'
export * from './legacy-leave-registered.event'
export * from './legacy-leave-updated.event'

// TODO Move it to another package ?
export type IHRISLeaveDomainEvent =
  | IHRISTimeManagementLeaveCancelledEvent
  | IHRISTimeManagementLeaveDismissedEvent
  | IHRISTimeManagementLeavePeriodUpdatedEvent
  | IHRISTimeManagementLeaveRegisteredEvent
  | IHRISTimeManagementLeaveRolledbackEvent
  | ILegacyLeaveCancelledEvent
  | ILegacyLeaveRegisteredEvent
  | ILegacyLeaveUpdatedEvent
