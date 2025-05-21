import { Inject, Injectable } from '@nestjs/common';
import { EdpClient, IPrivateEventStoreClient } from '@payfit/edp-client';
import { MappingService } from '../../mapping/mapping.service';
import { WorkscheduleCalendarRecordAggregate } from './aggregate/core';

@Injectable()
export class WorkscheduleCalendarRecordEdpService {
  private readonly EXTERNAL_TYPE: string = 'jlContractId';
  private readonly INTERNAL_TYPE: string = 'calendarRecordId';

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

  async getWorkscheduleCalendarRecordByJLContractId(jlContractId: string) {
    console.log('jlContractId', jlContractId);

    let events = [];
    let calendarRecordId = 'test';
    if (process.env.LOCAL === 'true') {
      throw new Error('Not implemented');
    } else {
      const mapping = await this.mappingService.queryLastByExternalId({
        externalId: jlContractId,
        externalType: this.EXTERNAL_TYPE,
        internalType: this.INTERNAL_TYPE,
      });

      calendarRecordId = mapping.internalId;
      events = await this.privateEventStoreWorkscheduleCalendarRecord
        .getEvents()
        .of('subjectId', calendarRecordId)
        .fetchAll();
    }

    console.log('calendarRecordId', calendarRecordId);

    const aggregate = WorkscheduleCalendarRecordAggregate.hydrate({
      initialState: { workscheduleCalendarRecord: undefined },
      id: calendarRecordId,
      events,
    });

    return {
      dataStore: aggregate.dataStore,
      history: aggregate.getHistory().sort((a, b) => a.eventTime - b.eventTime),
    };
  }
}
