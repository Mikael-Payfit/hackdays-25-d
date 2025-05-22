import { Inject, Injectable } from '@nestjs/common';
import { ISOFormatDate } from '@payfit/common-time-model';
import { EdpClient, IPrivateEventStoreClient } from '@payfit/edp-client';
import {
  PlannedWeekDay,
  WorkscheduleCalendarRecordAggregate,
} from '@payfit/workschedule/calendar-record-model';
import {
  addDays,
  eachDayOfInterval,
  endOfDay,
  format,
  isMonday,
  parseISO,
  startOfDay,
} from 'date-fns';
import { LeaveRegistryEdpService } from '../leave-registry/leave-registry-edp.service';
import { MappingService } from '../mapping/mapping.service';
@Injectable()
export class WorkscheduleCalendarRecordEdpService {
  hardCodedCompanyId = '65e590e7489e5b86ddcd359b';
  hardCodedContracts: { contractId: string; name: string }[] = [
    { contractId: '682f2d71907d1647b52e4179', name: 'Nigel Clockington' },
    { contractId: '682f2e8590ecf695ae96f51e', name: 'Benedic Timebottom' },
    { contractId: '682f2b9790ecf695ae96f4e7', name: 'Agatha Clockberry' },
  ];

  private readonly EXTERNAL_TYPE: string = 'jlContractId';
  private readonly INTERNAL_TYPE: string = 'employeeWorkscheduleRegistryId';

  private readonly privateEventStoreWorkscheduleCalendarRecord: IPrivateEventStoreClient;
  constructor(
    @Inject('WorkscheduleEdpClient')
    private readonly edpClient: EdpClient,
    private readonly mappingService: MappingService,
    private readonly leaveRegistryEdpService: LeaveRegistryEdpService
  ) {
    this.privateEventStoreWorkscheduleCalendarRecord =
      this.edpClient.getPrivateEventStoreClient({
        name: 'ws-calendar-record',
      });
  }

  async getWorkscheduleCalendarForDayForCompanyId(date: string) {
    console.log('getWorkscheduleCalendarForDayForCompanyId', date);

    const result = [];
    for (const contract of this.hardCodedContracts) {
      const records = await this.getWorkscheduleCalendarRecordsForMondays(
        contract.contractId,
        { begin: date, end: date }
      );
      const day = this.findDateInCalendar(
        date,
        records[0].dataStore.workscheduleCalendarRecord.plannedWeek
      );

      const leaves =
        await this.leaveRegistryEdpService.getLeaveRecordForDateForContract(
          contract.contractId,
          date
        );
      if (day) {
        result.push({
          contractId: contract.contractId,
          name: contract.name,
          day,
          leaves,
        });
      }
    }

    return result;
  }

  findDateInCalendar(date: string, plannedWeek: PlannedWeekDay[]) {
    for (const day of plannedWeek) {
      if (day.date === date) {
        return day;
      }
    }
    return null;
  }

  async getWorkscheduleCalendarRecordByJLContractId(
    jlContractId: string,
    period: { begin: string; end: string }
  ) {
    console.log('jlContractId', jlContractId);
    console.log('period', period);

    let events = [];
    let employeeWorkscheduleRegistryId = 'test';
    if (process.env.LOCAL === 'true') {
      throw new Error('Not implemented');
    } else {
      const mapping = await this.mappingService.queryLastByExternalId({
        externalId: jlContractId,
        externalType: this.EXTERNAL_TYPE,
        internalType: this.INTERNAL_TYPE,
      });

      employeeWorkscheduleRegistryId = mapping.internalId;
      events = await this.privateEventStoreWorkscheduleCalendarRecord
        .getEvents()
        .fromIndex(
          'payload.employeeWorkscheduleRegistryIdWithPeriodPartitionKey',
          `${employeeWorkscheduleRegistryId}_${period.begin}_${period.end}`
        )
        .fetchAll();
    }

    console.log(
      'employeeWorkscheduleRegistryId',
      employeeWorkscheduleRegistryId
    );

    const aggregate = WorkscheduleCalendarRecordAggregate.hydrate({
      initialState: { workscheduleCalendarRecord: undefined },
      id:
        'employeeWorkscheduleRegistryId_' +
        employeeWorkscheduleRegistryId +
        '_' +
        Math.random(),
      events,
    });

    return {
      dataStore: aggregate.dataStore,
      history: aggregate.getHistory().sort((a, b) => a.eventTime - b.eventTime),
      period,
    };
  }

  async getWorkscheduleCalendarRecordsForMondays(
    jlContractId: string,
    period: { begin: string; end: string }
  ) {
    const startDate = parseISO(period.begin);
    const endDate = parseISO(period.end);

    // Get all days within the period
    const allDays = eachDayOfInterval({ start: startDate, end: endDate });

    // Filter to get only Mondays
    const mondays = allDays.filter((day) => isMonday(day));

    // If period.begin is not a Monday, add the Monday before period.begin
    let mondayBeforeStart = null;
    if (!isMonday(startDate)) {
      mondayBeforeStart = addDays(startDate, -1);
      while (!isMonday(mondayBeforeStart)) {
        mondayBeforeStart = addDays(mondayBeforeStart, -1);
      }
    }
    if (mondayBeforeStart) {
      mondays.unshift(mondayBeforeStart);
    }

    const calendarRecords = [];
    for (const monday of mondays) {
      // Calculate the end of the week (Sunday)
      const sunday = endOfDay(addDays(monday, 6));

      // Format dates to ISO format
      const weekStartDate = format(
        startOfDay(monday),
        'yyyy-MM-dd'
      ) as ISOFormatDate;
      const weekEndDate = format(sunday, 'yyyy-MM-dd') as ISOFormatDate;
      calendarRecords.push(
        await this.getWorkscheduleCalendarRecordByJLContractId(jlContractId, {
          begin: weekStartDate,
          end: weekEndDate,
        })
      );
    }

    return calendarRecords;
  }
}
