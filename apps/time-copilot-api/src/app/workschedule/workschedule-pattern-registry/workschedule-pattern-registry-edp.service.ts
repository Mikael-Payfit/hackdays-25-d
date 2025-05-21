import { Inject, Injectable } from '@nestjs/common';
import { EdpClient, IPrivateEventStoreClient } from '@payfit/edp-client';
import { MappingService } from '../../mapping/mapping.service';
import { WorkschedulePatternRegistryAggregate } from './aggregate/core';

@Injectable()
export class WorkschedulePatternRegistryEdpService {
  private readonly EXTERNAL_TYPE: string = 'jlCompanyId';
  private readonly INTERNAL_TYPE: string = 'workschedulePatternRegistryId';

  private readonly privateEventStoreWorkschedulePatternRegistry: IPrivateEventStoreClient;
  constructor(
    @Inject('WorkscheduleEdpClient')
    private readonly edpClient: EdpClient,
    private readonly mappingService: MappingService
  ) {
    this.privateEventStoreWorkschedulePatternRegistry =
      this.edpClient.getPrivateEventStoreClient({
        name: 'ws-pattern-registry',
      });
  }

  async getWorkschedulePatternRegistryByJLCompanyId(jlCompanyId: string) {
    console.log('jlCompanyId', jlCompanyId);
    const mapping = await this.mappingService.queryLastByExternalId({
      externalId: jlCompanyId,
      externalType: this.EXTERNAL_TYPE,
      internalType: this.INTERNAL_TYPE,
    });
    console.log('workschedulePatternRegistryId', mapping.internalId);

    const leaveRegistryEvents =
      await this.privateEventStoreWorkschedulePatternRegistry
        .getEvents()
        .of('subjectId', mapping.internalId)
        .fetchAll();

    const aggregate = WorkschedulePatternRegistryAggregate.hydrate({
      initialState: [],
      id: mapping.internalId,
      events: leaveRegistryEvents,
    });

    return {
      dataStore: aggregate.dataStore,
      history: aggregate.getHistory().sort((a, b) => a.eventTime - b.eventTime),
    };
  }
}
