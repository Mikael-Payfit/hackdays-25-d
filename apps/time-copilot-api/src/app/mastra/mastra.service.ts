import { createLogger, Mastra } from '@mastra/core';
import { LibSQLStore } from '@mastra/libsql';
import { Injectable } from '@nestjs/common';
import { MastraAgent } from './mastra.agent';

@Injectable()
export class MastraService {
  public mastra: Mastra;
  constructor(private readonly mastraAgent: MastraAgent) {
    this.mastra = new Mastra({
      agents: { time: this.mastraAgent.agent },
      storage: new LibSQLStore({
        url: ':memory:',
      }),
      logger: createLogger({
        name: 'Mastra',
        level: 'info',
      }),
    });
  }

  generate(query: string) {
    console.log('query', query);
    return this.mastra.getAgent('time').generate(query);
  }
}
