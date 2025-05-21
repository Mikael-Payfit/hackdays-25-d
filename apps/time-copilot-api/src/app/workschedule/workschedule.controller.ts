import { Controller, Get, Param } from '@nestjs/common';
import { WorkschedulePatternRegistryEdpService } from './workschedule-pattern-registry/workschedule-pattern-registry-edp.service';

@Controller('workschedule')
export class WorkscheduleController {
  constructor(
    private readonly workscheduleEdpService: WorkschedulePatternRegistryEdpService
  ) {}

  @Get('pattern/:jlCompanyId')
  getData(@Param('jlCompanyId') jlCompanyId: string) {
    return this.workscheduleEdpService.getWorkschedulePatternRegistryByJLCompanyId(
      jlCompanyId
    );
  }
}
