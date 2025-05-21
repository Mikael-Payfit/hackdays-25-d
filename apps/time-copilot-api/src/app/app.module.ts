import { Module } from '@nestjs/common';
import { MastraModule } from './mastra/mastra.module';
import { EdpClient } from '@payfit/edp-client';

@Module({
  imports: [MastraModule],
  controllers: [],
  providers: [{
    provide: 'LeaveRegistryEdpClient',
    useFactory: () => {
      return new EdpClient({
        serviceName: 'time-absences',
      })
    }
  }],
})
export class AppModule {}
