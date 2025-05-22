import { Controller, Get, Param } from '@nestjs/common';
import { LeaveRegistryEdpService } from '../leave-registry/leave-registry-edp.service';

@Controller('leave-registry')
export class LeaveRegistryController {
  constructor(
    private readonly leaveRegistryEdpService: LeaveRegistryEdpService
  ) {}

  @Get(':jlContractId')
  getData(@Param('jlContractId') jlContractId: string) {
    return this.leaveRegistryEdpService.getLeaveRegistryByJLContractId(
      jlContractId
    );
  }

  @Get('id/:jlContractId')
  async getLeaveRegistryId(@Param('jlContractId') jlContractId: string) {
    const leaveRegistryId =
      await this.leaveRegistryEdpService.getLeaveRegistryId(jlContractId);
    return {
      leaveRegistryId,
    };
  }
}
