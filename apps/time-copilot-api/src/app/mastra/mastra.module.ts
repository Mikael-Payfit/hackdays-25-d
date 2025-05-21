import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Module } from '@nestjs/common';
import { EdpClient } from '@payfit/edp-client';
import { LeaveRegistryEdpService } from '../leave-registry/leave-registry-edp.service';
import { MappingService } from '../mapping/mapping.service';
import { MastraAgent } from './mastra.agent';
import { MastraController } from './mastra.controller';
import { ToolMastraLeaveRegistry } from './tools/mastra.leave-registry.tool';
import { MastraService } from './mastra.service';

@Module({
  imports: [],
  controllers: [MastraController],
  providers: [
    LeaveRegistryEdpService,
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
    MastraAgent,
    ToolMastraLeaveRegistry,
    MastraService,
  ],
  exports: [],
})
export class MastraModule {}
