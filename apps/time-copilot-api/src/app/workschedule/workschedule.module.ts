import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Module } from '@nestjs/common';
import { EdpClient } from '@payfit/edp-client';
import { MappingService } from '../mapping/mapping.service';
import { WorkscheduleCalendarRecordEdpService } from './calendar-record-edp.service';
import { WorkscheduleController } from './workschedule.controller';
import { LeaveRegistryModule } from '../leave-registry/leave-registry.module';

@Module({
  imports: [LeaveRegistryModule],
  controllers: [WorkscheduleController],
  providers: [
    MappingService,
    {
      provide: 'WorkscheduleEdpClient',
      useFactory: () => {
        if (process.env.LOCAL === 'true') {
          return {
            getPrivateEventStoreClient: () => ({}),
          };
        }

        return new EdpClient({
          serviceName: 'workschedule',
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
    WorkscheduleCalendarRecordEdpService,
  ],
})
export class WorkscheduleModule {}
