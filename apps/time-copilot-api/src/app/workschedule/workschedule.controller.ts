import { Body, Controller, Post } from '@nestjs/common';
import { WorkscheduleCalendarRecordEdpService } from './calendar-record-edp.service';

@Controller('workschedule')
export class WorkscheduleController {
  constructor(
    private readonly workscheduleCalendarRecordEdpService: WorkscheduleCalendarRecordEdpService
  ) {}

  @Post('calendar')
  getData(
    @Body()
    body: {
      jlContractId: string;
      period: { begin: string; end: string };
    }
  ) {
    console.log('appel POST /workschedule/calendar/', body);
    return this.workscheduleCalendarRecordEdpService.getWorkscheduleCalendarRecordsForMondays(
      body.jlContractId,
      body.period
    );
  }

  @Post('team')
  getTeam(
    @Body()
    body: {
      date: string;
    }
  ) {
    console.log('appel POST /workschedule/team/', body);
    return this.workscheduleCalendarRecordEdpService.getWorkscheduleCalendarForDayForCompanyId(
      body.date
    );
  }
}
