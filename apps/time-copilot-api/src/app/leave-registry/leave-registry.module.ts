import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Module } from '@nestjs/common';
import { EdpClient } from '@payfit/edp-client';
import { MappingService } from '../mapping/mapping.service';
import { LeaveRegistryEdpService } from './leave-registry-edp.service';
import { LeaveRegistryController } from './leave-registry.controller';

@Module({
  imports: [],
  controllers: [LeaveRegistryController],
  providers: [
    MappingService,
    {
      provide: 'LeaveRegistryEdpClient',
      useFactory: () => {
        if (process.env.LOCAL === 'true') {
          return {
            getPrivateEventStoreClient: () => ({}),
          };
        }

        return new EdpClient({
          serviceName: 'time-absences',
        });
      },
    },
    {
      provide: 'DynamoDBDocumentClient',
      useFactory: () => {
        const client = new DynamoDBClient();
        return DynamoDBDocumentClient.from(client);
      },
    },
    LeaveRegistryEdpService,
  ],
  exports: [LeaveRegistryEdpService],
})
export class LeaveRegistryModule {}
