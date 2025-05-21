import { Inject, Injectable } from '@nestjs/common';
import { EdpClient, IPrivateEventStoreClient } from '@payfit/edp-client';

@Injectable()
export class LeaveRegistryService {
  private readonly privateEventStoreLeaveRegistry: IPrivateEventStoreClient;
  constructor(
    @Inject('LeaveRegistryEdpClient') private readonly edpClient: EdpClient
  ) {
    this.privateEventStoreLeaveRegistry = edpClient.getPrivateEventStoreClient({
      name: 'pr-es-leave-registry',
    });
  }

  async getLeaveRegistriesByJLContractId(jlContractId: string) {
    const leaveRegistryId = `leave-registry-${jlContractId}`;
    const leaveRegistry = await this.privateEventStoreLeaveRegistry
      .getEvents()
      .of('subjectId', leaveRegistryId)
      .fetchAll();
    return leaveRegistry;
  }
}
