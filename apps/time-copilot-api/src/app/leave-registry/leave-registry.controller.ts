import { Controller, Get, Param } from '@nestjs/common';
import { LeaveRegistryEdpService } from '../leave-registry/leave-registry-edp.service';

@Controller('leave-registry')
export class LeaveRegistryController {
  constructor(
    private readonly leaveRegistryEdpService: LeaveRegistryEdpService
  ) {}

  @Get(':jlContractId')
  getData(@Param('jlContractId') jlContractId: string) {
    return this.leaveRegistryEdpService.getLeaveRegistriesByJLContractId(
      jlContractId
    );
  }
}
