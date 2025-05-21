import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Module } from '@nestjs/common';
import { EdpClient } from '@payfit/edp-client';
import { LeaveRegistryEdpService } from './leave-registry-edp.service';
import { LeaveRegistryController } from './leave-registry.controller';
import { MappingService } from '../mapping/mapping.service';

@Module({
  imports: [],
  controllers: [LeaveRegistryController],
  providers: [
    MappingService,
    {
      provide: 'LeaveRegistryEdpClient',
      useFactory: () => {
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
})
export class LeaveRegistryModule {}
