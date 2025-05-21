import { ISOFormatDate, MomentOfDay } from '../../../common/models';
import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface';
import { LeavePeriodUpdatedEvent } from './leave-period-updated.event';

export function applyLeavePeriodUpdated(
  aggregate: ILeaveRegistryAggregate,
  event: LeavePeriodUpdatedEvent
): void {
  const leaveRecord = aggregate.getLeaveRecordByLeaveRecordId(
    event.payload.leaveRecordId
  );
  if (leaveRecord) {
    leaveRecord.leavePeriod = {
      begin: {
        date: event.payload.newBeginDate as ISOFormatDate,
        moment: event.payload.newBeginMoment as MomentOfDay,
      },
      end: {
        date: event.payload.newEndDate as ISOFormatDate,
        moment: event.payload.newEndMoment as MomentOfDay,
      },
    };
  }
}
