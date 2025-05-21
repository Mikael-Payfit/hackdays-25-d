import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LeaveRegistryEdpService } from '../leave-registry/leave-registry-edp.service';
import { MastraService } from './mastra.service';

@Controller('mastra')
export class MastraController {
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
  generate(@Body() body: { prompt: string }) {
    return this.mastraService.generate(body.prompt);
  }
}
