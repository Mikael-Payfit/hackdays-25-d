import { GenerateWorkscheduleWorkweekCalendarRecordInput } from '../generate-workweek-calendar-record/generate-workschedule-workweek-calendar-record.operation'

export interface IWorkscheduleCalendarRecordAggregate {
  generateWorkscheduleCalendarRecord(
    input: GenerateWorkscheduleWorkweekCalendarRecordInput,
  ): void
  regenerateWorkscheduleCalendarRecord(
    input: GenerateWorkscheduleWorkweekCalendarRecordInput,
  ): void
}
