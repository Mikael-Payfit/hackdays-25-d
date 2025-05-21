import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LeaveRegistryEdpService } from '../leave-registry/leave-registry-edp.service';
import { MastraService } from './mastra.service';

@Controller('mastra')
export class MastraController {
  private memoryPreviousMessages: Record<
    string,
    { input: string; output: string }[]
  > = {};

  constructor(
    private readonly leaveRegistryEdpService: LeaveRegistryEdpService,
    private readonly mastraService: MastraService
  ) {}

  @Get(':jlContractId')
  getData(@Param('jlContractId') jlContractId: string) {
    return this.leaveRegistryEdpService.getLeaveRegistriesByJLContractId(
      jlContractId
    );
  }

  @Post()
  async generate(@Body() body: { prompt: string; threadId: string }) {
    const history = this.memoryPreviousMessages[body.threadId]
      ?.map((item) => `- Input: ${item.input}\n- Output: ${item.output}`)
      .join('\n');

    console.log('history', history);

    const output = (
      await this.mastraService.generate(
        `
      This is the new prompt: ${body.prompt},
      This is the conversation history:
        ${history}
      `,
        body.threadId
      )
    ).text;
    const threadItem = { input: body.prompt, output };
    this.memoryPreviousMessages[body.threadId] = [
      ...(this.memoryPreviousMessages[body.threadId] || []),
      threadItem,
    ];
    return output;
  }
}
