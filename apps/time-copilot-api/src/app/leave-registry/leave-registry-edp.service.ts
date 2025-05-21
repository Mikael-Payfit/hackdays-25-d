import { Inject, Injectable } from '@nestjs/common';
import { EdpClient, IPrivateEventStoreClient } from '@payfit/edp-client';
import { IEdpBasePayloadEvent, IEdpEvent } from '@payfit/edp-models';
import { MappingService } from '../mapping/mapping.service';
import { LeaveRegistryAggregate } from './aggregate/core/leave-registry.aggregate';
import { LeaveRegistrySnapshot } from './aggregate/core/leave-registry.snapshot';
import { mockedEvents } from './events-mock';

@Injectable()
export class LeaveRegistryEdpService {
  private readonly EXTERNAL_TYPE: string = 'jlContractId';
  private readonly INTERNAL_TYPE: string = 'leaveRegistryId';

  private readonly privateEventStoreLeaveRegistry: IPrivateEventStoreClient;
  constructor(
    @Inject('LeaveRegistryEdpClient') private readonly edpClient: EdpClient,
    private readonly mappingService: MappingService
  ) {
    this.privateEventStoreLeaveRegistry =
      this.edpClient.getPrivateEventStoreClient({
        name: 'pr-es-leave-registry',
      });
  }

  async getLeaveRegistriesByJLContractId(jlContractId: string) {
    console.log('jlContractId', jlContractId);
    let events: IEdpEvent<IEdpBasePayloadEvent>[] = [];
    let leaveRegistryId = 'test';
    if (process.env.LOCAL === 'true') {
      leaveRegistryId = 'test';
      events = mockedEvents;

      const mapping = await this.mappingService.queryLastByExternalId({
        externalId: jlContractId,
        externalType: this.EXTERNAL_TYPE,
        internalType: this.INTERNAL_TYPE,
      });

      leaveRegistryId = mapping.internalId;
      events = await this.privateEventStoreLeaveRegistry
        .getEvents()
        .of('subjectId', mapping.internalId)
        .fetchAll();
    }

    console.log('leaveRegistryId', leaveRegistryId);

    const aggregate = LeaveRegistryAggregate.hydrate({
      snapshot: new LeaveRegistrySnapshot(leaveRegistryId),
      jlContractId,
      jlCompanyId: 'testCompany',
      events,
    });

    return {
      dataStore: aggregate.getDataStore(),
      history: aggregate.getHistory().sort((a, b) => a.eventTime - b.eventTime),
    };
  }
}
