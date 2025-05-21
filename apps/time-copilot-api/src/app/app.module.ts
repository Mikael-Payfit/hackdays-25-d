import { Module } from '@nestjs/common';
import { MastraModule } from './mastra/mastra.module';

@Module({
  imports: [MastraModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
