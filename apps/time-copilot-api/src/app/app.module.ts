import { Module } from '@nestjs/common';
import { LeaveRegistryModule } from './leave-registry/leave-registry.module';

@Module({
  imports: [LeaveRegistryModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
