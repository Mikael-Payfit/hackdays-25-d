import { Module } from '@nestjs/common';
import { LeaveRegistryModule } from './leave-registry/leave-registry.module';
import { WorkscheduleModule } from './workschedule/workschedule.module';

@Module({
  imports: [LeaveRegistryModule, WorkscheduleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
