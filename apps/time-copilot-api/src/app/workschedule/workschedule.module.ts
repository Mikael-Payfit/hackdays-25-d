import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Module } from '@nestjs/common';
import { EdpClient } from '@payfit/edp-client';
import { MappingService } from '../mapping/mapping.service';
import { WorkscheduleController } from './workschedule.controller';
import { WorkscheduleCalendarRecordEdpService } from './calendar-record-edp.service';

@Module({
  imports: [],
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
