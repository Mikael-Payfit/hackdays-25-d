import { Actor, ISOFormatDate } from '@payfit/common-time-model'
import { WorkweekPatternRecord } from '@payfit/workschedule/pattern-registry-model'
import { WorkscheduleCalendarRecordAggregate } from './workschedule-calendar-record.aggregate'
import { WorkweekCalendarRecord } from './workschedule-calendar-record.entity'

describe('WorkscheduleCalendarRecordAggregate', () => {
  const recordId = 'record-1'

  let aggregate: WorkscheduleCalendarRecordAggregate

  beforeEach(() => {
    aggregate = WorkscheduleCalendarRecordAggregate.hydrate({
      id: recordId,
      initialState: {},
      events: [],
    })
  })

  describe('initialization', () => {
    it('should create a new aggregate', () => {
      expect(aggregate).toBeDefined()
      expect(aggregate.id).toBe(recordId)
      expect(aggregate.hydrated).toBe(false)
    })
  })

  describe('createNewWithWorkweekPatternRecord', () => {
    const mockWorkweekPatternRecord = new WorkweekPatternRecord({
      id: 'pattern-1',
      name: 'Test Pattern',
      description: 'Test Description',
      definition: {
        monday: {
          timeslots: [{ startTime: '09:00', endTime: '17:00' }],
          isJourOuvrable: true,
          isJourOuvre: true,
        },
        tuesday: {
          timeslots: [{ startTime: '09:00', endTime: '17:00' }],
          isJourOuvrable: true,
          isJourOuvre: true,
        },
        thursday: {
          timeslots: [{ startTime: '09:00', endTime: '17:00' }],
          isJourOuvrable: true,
          isJourOuvre: true,
        },
        wednesday: {
          timeslots: [{ startTime: '09:00', endTime: '17:00' }],
          isJourOuvrable: true,
          isJourOuvre: true,
        },
        friday: {
          timeslots: [{ startTime: '09:00', endTime: '17:00' }],
          isJourOuvrable: true,
          isJourOuvre: true,
        },
        saturday: {
          timeslots: [],
          isJourOuvrable: true,
          isJourOuvre: true,
        },
        sunday: {
          timeslots: [],
          isJourOuvrable: true,
          isJourOuvre: true,
        },
      },
    })

    const actor: Actor = { id: 'actor-1', name: 'actor-1', role: 'admin' }

    it('should create a new aggregate with workweek pattern record', () => {
      const newAggregate: WorkscheduleCalendarRecordAggregate =
        WorkscheduleCalendarRecordAggregate.createNewWithWorkweekPatternRecord({
          country: 'france',
          employeeWorkscheduleRegistryId: 'emp-1',
          employeeWorkscheduleRegistryVersion: 1,
          workschedulePatternRecordId: 'pattern-1',
          workweekPatternRecord: mockWorkweekPatternRecord,
          companyWeekParams: [],
          publicHolidays: {},
          startDate: '2025-01-06' as ISOFormatDate,
          endDate: '2025-01-12' as ISOFormatDate,
          actor,
        })

      expect(newAggregate).toBeDefined()
      expect(newAggregate.id).toBeDefined()

      const workweekCalendarRecord = newAggregate.dataStore
        .workscheduleCalendarRecord as WorkweekCalendarRecord

      expect(workweekCalendarRecord.period).toEqual({
        startDate: '2025-01-06' as ISOFormatDate, // don't change this date, this is a monday
        endDate: '2025-01-12' as ISOFormatDate, // don't change this date, this is a sunday
      })
      const plannedWeek = workweekCalendarRecord.plannedWeek.map((day) => {
        return {
          date: day.date,
          day: day.day,
          isPublicHoliday: day.isPublicHoliday,
          isJourOuvrable: day.isJourOuvrable,
          isJourOuvre: day.isJourOuvre,
          timeslots: day.timeslots.map((timeslot) => {
            return {
              startTime: timeslot.startTime,
              endTime: timeslot.endTime,
            }
          }),
        }
      })
      const workschedulePatternRecord =
        workweekCalendarRecord.workschedulePatternRecord as WorkweekPatternRecord
      expect(plannedWeek).toEqual([
        {
          date: '2025-01-06',
          day: 'monday',
          isPublicHoliday: false,
          timeslots: workschedulePatternRecord.definition.monday.timeslots,
          isJourOuvrable: true,
          isJourOuvre: true,
        },
        {
          date: '2025-01-07',
          day: 'tuesday',
          isPublicHoliday: false,
          timeslots: workschedulePatternRecord.definition.tuesday.timeslots,
          isJourOuvrable: true,
          isJourOuvre: true,
        },
        {
          date: '2025-01-08',
          day: 'wednesday',
          isPublicHoliday: false,
          timeslots: workschedulePatternRecord.definition.wednesday.timeslots,
          isJourOuvrable: true,
          isJourOuvre: true,
        },
        {
          date: '2025-01-09',
          day: 'thursday',
          isPublicHoliday: false,
          timeslots: workschedulePatternRecord.definition.thursday.timeslots,
          isJourOuvrable: true,
          isJourOuvre: true,
        },
        {
          date: '2025-01-10',
          day: 'friday',
          isPublicHoliday: false,
          isJourOuvrable: true,
          isJourOuvre: true,
          timeslots: workschedulePatternRecord.definition.friday.timeslots,
        },
        {
          date: '2025-01-11',
          day: 'saturday',
          isPublicHoliday: false,
          timeslots: workschedulePatternRecord.definition.saturday.timeslots,
          isJourOuvrable: true,
          isJourOuvre: true,
        },
        {
          date: '2025-01-12',
          day: 'sunday',
          isPublicHoliday: false,
          timeslots: workschedulePatternRecord.definition.sunday.timeslots,
          isJourOuvrable: true,
          isJourOuvre: true,
        },
      ])

      expect(workweekCalendarRecord.workschedulePatternRecordId).toEqual(
        'pattern-1',
      )

      expect(workweekCalendarRecord.workschedulePatternRecord).toEqual(
        mockWorkweekPatternRecord,
      )

      expect(workweekCalendarRecord.employeeWorkscheduleRegistryId).toEqual(
        'emp-1',
      )

      expect(
        workweekCalendarRecord.employeeWorkscheduleRegistryVersion,
      ).toEqual(1)
    })
  })
})
