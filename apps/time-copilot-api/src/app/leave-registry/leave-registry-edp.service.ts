import { Inject, Injectable } from '@nestjs/common';
import { ISOFormatDate, MomentOfDay } from '@payfit/common-time-model';
import { EdpClient, IPrivateEventStoreClient } from '@payfit/edp-client';
import { IEdpBasePayloadEvent, IEdpEvent } from '@payfit/edp-models';
import {
  LeaveRegistryAggregate,
  LeaveRegistrySnapshot,
} from '@payfit/leave-registry-model';
import { MappingService } from '../mapping/mapping.service';
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

  async getLeaveRecordForDateForContract(jlContractId: string, date: string) {
    const leaveRegistry = await this.getLeaveRegistryByJLContractId(
      jlContractId
    );
    const result = [];
    for (const leaveRecord of leaveRegistry.dataStore.leaveRecords) {
      if (
        leaveRecord.isOverlapping({
          begin: {
            date: date as ISOFormatDate,
            moment: MomentOfDay.BEGINNING,
          },
          end: {
            date: date as ISOFormatDate,
            moment: MomentOfDay.END,
          },
        })
      ) {
        result.push(leaveRecord);
      }
    }
    return result;
  }
  async getLeaveRegistryId(jlContractId: string): Promise<string> {
    const mapping = await this.mappingService.queryLastByExternalId({
      externalId: jlContractId,
      externalType: this.EXTERNAL_TYPE,
      internalType: this.INTERNAL_TYPE,
    });
    return mapping?.internalId ?? null;
  }
  async getLeaveRegistryByJLContractId(jlContractId: string) {
    console.log('jlContractId', jlContractId);
    let events: IEdpEvent<IEdpBasePayloadEvent>[] = [];
    let leaveRegistryId = 'test';
    if (process.env.LOCAL === 'true') {
      leaveRegistryId = 'test';
      events = mockedEvents;
    } else {
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
