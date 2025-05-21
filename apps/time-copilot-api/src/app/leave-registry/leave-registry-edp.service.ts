import { Inject, Injectable } from '@nestjs/common';
import { EdpClient, IPrivateEventStoreClient } from '@payfit/edp-client';
import { MappingService } from '../mapping/mapping.service';
import { LeaveRegistryAggregate } from './aggregate/core/leave-registry.aggregate';
import { LeaveRegistrySnapshot } from './aggregate/core/leave-registry.snapshot';

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
    const mapping = await this.mappingService.queryLastByExternalId({
      externalId: jlContractId,
      externalType: this.EXTERNAL_TYPE,
      internalType: this.INTERNAL_TYPE,
    });
    console.log('leaveRegistryId', mapping.internalId);

    const leaveRegistryEvents = await this.privateEventStoreLeaveRegistry
      .getEvents()
      .of('subjectId', mapping.internalId)
      .fetchAll();

    const aggregate = LeaveRegistryAggregate.hydrate({
      snapshot: new LeaveRegistrySnapshot(mapping.internalId),
      jlContractId,
      jlCompanyId: 'testCompany',
      events: leaveRegistryEvents,
    });

    return {
      dataStore: aggregate.getDataStore(),
      history: aggregate.getHistory().sort((a, b) => a.eventTime - b.eventTime),
    };
  }
}
