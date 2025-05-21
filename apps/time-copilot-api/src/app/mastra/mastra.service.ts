import { createLogger, Mastra } from '@mastra/core';
import { Injectable } from '@nestjs/common';
import { MastraAgent } from './mastra.agent';

@Injectable()
export class MastraService {
  public mastra: Mastra;
  constructor(private readonly mastraAgent: MastraAgent) {
    this.mastra = new Mastra({
      agents: { time: this.mastraAgent.agent },
      logger: createLogger({
        name: 'Mastra',
        level: 'info',
      }),
    });
  }

  async generate(query: string, threadId: string) {
    console.log('query', query);
    return this.mastra.getAgent('time').generate(query, {
      resourceId: 'time',
      threadId,
    });
  }
}
