import { Controller, Get, Param } from '@nestjs/common';
import { WorkscheduleCalendarRecordEdpService } from './calendar-record/calendar-record-edp.service';

@Controller('workschedule')
export class WorkscheduleController {
  constructor(
    private readonly workscheduleCalendarRecordEdpService: WorkscheduleCalendarRecordEdpService
  ) {}

  @Get('calendar/:jlContractId')
  getData(@Param('jlContractId') jlContractId: string) {
    return this.workscheduleCalendarRecordEdpService.getWorkscheduleCalendarRecordByJLContractId(
      jlContractId
    );
  }
}
