import { Inject, Injectable } from '@nestjs/common';
import { ISOFormatDate } from '@payfit/common-time-model';
import { EdpClient, IPrivateEventStoreClient } from '@payfit/edp-client';
import { WorkscheduleCalendarRecordAggregate } from '@payfit/workschedule/calendar-record-model';
import {
  addDays,
  eachDayOfInterval,
  endOfDay,
  format,
  isMonday,
  parseISO,
  startOfDay,
} from 'date-fns';
import { MappingService } from '../mapping/mapping.service';
@Injectable()
export class WorkscheduleCalendarRecordEdpService {
  private readonly EXTERNAL_TYPE: string = 'jlContractId';
  private readonly INTERNAL_TYPE: string = 'employeeWorkscheduleRegistryId';

  private readonly privateEventStoreWorkscheduleCalendarRecord: IPrivateEventStoreClient;
  constructor(
    @Inject('WorkscheduleEdpClient')
    private readonly edpClient: EdpClient,
    private readonly mappingService: MappingService
  ) {
    this.privateEventStoreWorkscheduleCalendarRecord =
      this.edpClient.getPrivateEventStoreClient({
        name: 'ws-calendar-record',
      });
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
