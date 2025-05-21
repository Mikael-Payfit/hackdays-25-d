import {
  CountryCode,
  ISOFormatDate,
  MomentOfDay,
} from '../../../common/models';
import { ILeaveRegistryAggregate } from '../core/leave-registry.aggregate.interface';
import {
  GlobalLeaveType,
  LeaveRecord,
  LeaveStatusHelper,
} from '../core/value-objects';
import { LeaveRequestedEvent } from './leave-requested.event';

export function applyLeaveRequested(
  aggregate: ILeaveRegistryAggregate,
  event: LeaveRequestedEvent
) {
  const newLeaveRecord = new LeaveRecord({
    leaveRecordId: event.payload.leaveRecordId,
    from: 'leaveRecordsModel',
    leaveType: {
      name: event.payload.type as GlobalLeaveType,
      country: event.payload.country as CountryCode,
    },
    leavePeriod: {
      begin: {
        date: event.payload.beginDate as ISOFormatDate,
        moment: event.payload.beginMoment as MomentOfDay,
      },
      end: {
        date: event.payload.endDate as ISOFormatDate,
        moment: event.payload.endMoment as MomentOfDay,
      },
    },
    leaveStatus: LeaveStatusHelper.getDraft(),
    associatedExternalIds: [],
  });
  if (!aggregate.hasExistingLeaveRecord({ leaveRecordId: newLeaveRecord.id })) {
    aggregate.getDataStore().leaveRecords.push(newLeaveRecord);
  }

  // Submission
  const submission = aggregate.getSubmission(event.payload.submissionId);
  if (submission) {
    submission.addLeaveRecord(newLeaveRecord);
  }
}
