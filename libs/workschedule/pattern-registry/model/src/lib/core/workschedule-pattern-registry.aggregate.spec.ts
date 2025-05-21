import { systemActor } from '@payfit/common-time-model'
import {
  WorkweekDayPatternDefinition,
  WorkweekDayPatternRecord,
} from '../workweek-day-pattern/workweek-day-pattern.entity'
import {
  WorkweekHalfDaysPatternDefinition,
  WorkweekHalfDaysPatternRecord,
} from '../workweek-half-days-pattern/workweek-half-days-pattern.entity'
import {
  WorkweekPatternDefinition,
  WorkweekPatternRecord,
} from '../workweek-pattern/workweek-pattern.entity'
import { PatternNameAlreadyExistError } from './errors'
import { PatternDefinitionInvalidSlotsSizeError } from './errors/pattern-definition-invalid-slots-size.error'
import { PatternNotFoundError } from './errors/pattern-not-found.error'
import { PatternUpdateSameValueError } from './errors/pattern-update-same-value.error'
import { WorkschedulePatternRegistryAggregate } from './workschedule-pattern-registry.aggregate'

describe('WorkschedulePatternRegistryAggregate', () => {
  const registryId = 'registry-1'

  let aggregate: WorkschedulePatternRegistryAggregate

  beforeEach(() => {
    aggregate = WorkschedulePatternRegistryAggregate.hydrate({
      id: registryId,
      initialState: [],
      events: [],
    })
  })

  describe('initialization', () => {
    it('should create a new aggregate', () => {
      expect(aggregate).toBeDefined()
      expect(aggregate.id).toBe(registryId)
      expect(aggregate.dataStore.length).toBe(0)
      expect(aggregate.hydrated).toBe(false)
    })
  })

  describe('defineNewWorkweekTimeSlotsPatternRecord', () => {
    it('should create a new reference work week pattern', () => {
      const exampleWorkweekPatternDefinition: WorkweekPatternDefinition = {
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
        wednesday: {
          timeslots: [{ startTime: '09:00', endTime: '17:00' }],
          isJourOuvrable: true,
          isJourOuvre: true,
        },
        thursday: {
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
      }
      const { workschedulePatternRecordId } =
        aggregate.defineNewWorkweekTimeSlotsPatternRecord({
          name: 'Standard Work Week',
          description: 'Standard 5 days work week',
          workschedulePatternDefinition: exampleWorkweekPatternDefinition,
          actor: systemActor,
        })

      expect(aggregate.getPatternById(workschedulePatternRecordId)).toEqual(
        new WorkweekPatternRecord({
          id: workschedulePatternRecordId,
          name: 'Standard Work Week',
          description: 'Standard 5 days work week',
          definition: exampleWorkweekPatternDefinition,
        }),
      )
    })

    it('should not allow to create a new reference work week pattern with more than 2 slots', () => {
      const exampleWorkweekPatternDefinition: WorkweekPatternDefinition = {
        monday: {
          timeslots: [
            { startTime: '09:00', endTime: '10:00' },
            { startTime: '10:00', endTime: '11:00' },
            { startTime: '11:00', endTime: '12:00' },
          ],
          isJourOuvrable: true,
          isJourOuvre: true,
        },
        tuesday: {
          timeslots: [],
          isJourOuvrable: true,
          isJourOuvre: true,
        },
        wednesday: {
          timeslots: [],
          isJourOuvrable: true,
          isJourOuvre: true,
        },
        thursday: {
          timeslots: [],
          isJourOuvrable: true,
          isJourOuvre: true,
        },
        friday: {
          timeslots: [],
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
      }

      expect(() => {
        aggregate.defineNewWorkweekTimeSlotsPatternRecord({
          name: 'Invalid Work Week',
          description: 'Invalid work week',
          workschedulePatternDefinition: exampleWorkweekPatternDefinition,
          actor: systemActor,
        })
      }).toThrow(PatternDefinitionInvalidSlotsSizeError)
    })
  })

  describe('updateWorkweekPatternRecord', () => {
    it('should update an existing pattern', () => {
      const exampleWorkweekPatternRecord: WorkweekPatternDefinition = {
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
        wednesday: {
          timeslots: [{ startTime: '09:00', endTime: '17:00' }],
          isJourOuvrable: true,
          isJourOuvre: true,
        },
        thursday: {
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
      }

      const { workschedulePatternRecordId } =
        aggregate.defineNewWorkweekTimeSlotsPatternRecord({
          name: 'Standard Work Week',
          description: 'Standard 5 days work week',
          workschedulePatternDefinition: exampleWorkweekPatternRecord,
          actor: systemActor,
        })

      const updatedPattern: WorkweekPatternDefinition = {
        monday: {
          timeslots: [{ startTime: '10:00', endTime: '17:00' }],
          isJourOuvrable: true,
          isJourOuvre: true,
        },
        tuesday: {
          timeslots: [{ startTime: '10:00', endTime: '17:00' }],
          isJourOuvrable: true,
          isJourOuvre: true,
        },
        wednesday: {
          timeslots: [{ startTime: '10:00', endTime: '17:00' }],
          isJourOuvrable: true,
          isJourOuvre: true,
        },
        thursday: {
          timeslots: [{ startTime: '10:00', endTime: '17:00' }],
          isJourOuvrable: true,
          isJourOuvre: true,
        },
        friday: {
          timeslots: [{ startTime: '10:00', endTime: '17:00' }],
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
      }

      aggregate.updateWorkweekPatternRecord({
        workschedulePatternRecordId,
        name: 'Updated Work Week',
        description: 'Updated standard work week',
        workschedulePatternDefinition: updatedPattern,
        actor: systemActor,
      })

      expect(aggregate.getPatternById(workschedulePatternRecordId)).toEqual(
        new WorkweekPatternRecord({
          id: workschedulePatternRecordId,
          name: 'Updated Work Week',
          description: 'Updated standard work week',
          definition: updatedPattern,
        }),
      )
    })
    it('should throw error when updating non-existing pattern', () => {
      const updatedPattern: WorkweekPatternDefinition = {
        monday: {
          timeslots: [{ startTime: '10:00', endTime: '17:00' }],
          isJourOuvrable: true,
          isJourOuvre: true,
        },
        tuesday: {
          timeslots: [{ startTime: '10:00', endTime: '17:00' }],
          isJourOuvrable: true,
          isJourOuvre: true,
        },
        wednesday: {
          timeslots: [{ startTime: '10:00', endTime: '17:00' }],
          isJourOuvrable: true,
          isJourOuvre: true,
        },
        thursday: {
          timeslots: [{ startTime: '10:00', endTime: '17:00' }],
          isJourOuvrable: true,
          isJourOuvre: true,
        },
        friday: {
          timeslots: [{ startTime: '10:00', endTime: '17:00' }],
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
      }

      expect(() => {
        aggregate.updateWorkweekPatternRecord({
          workschedulePatternRecordId: 'non-existing-id',
          name: 'Updated Work Week',
          description: 'Updated standard work week',
          workschedulePatternDefinition: updatedPattern,
          actor: systemActor,
        })
      }).toThrow(PatternNotFoundError)
    })

    it('should not update when no changes are provided', () => {
      const exampleWorkweekPatternRecord: WorkweekPatternDefinition = {
        monday: {
          timeslots: [{ startTime: '10:00', endTime: '17:00' }],
          isJourOuvrable: true,
          isJourOuvre: true,
        },
        tuesday: {
          timeslots: [{ startTime: '10:00', endTime: '17:00' }],
          isJourOuvrable: true,
          isJourOuvre: true,
        },
        wednesday: {
          timeslots: [{ startTime: '10:00', endTime: '17:00' }],
          isJourOuvrable: true,
          isJourOuvre: true,
        },
        thursday: {
          timeslots: [{ startTime: '10:00', endTime: '17:00' }],
          isJourOuvrable: true,
          isJourOuvre: true,
        },
        friday: {
          timeslots: [{ startTime: '10:00', endTime: '17:00' }],
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
      }

      const { workschedulePatternRecordId } =
        aggregate.defineNewWorkweekTimeSlotsPatternRecord({
          name: 'Standard Work Week',
          description: 'Standard 5 days work week',
          workschedulePatternDefinition: exampleWorkweekPatternRecord,
          actor: systemActor,
        })

      expect(() => {
        aggregate.updateWorkweekPatternRecord({
          workschedulePatternRecordId: workschedulePatternRecordId,
          name: 'Standard Work Week',
          description: 'Standard 5 days work week',
          workschedulePatternDefinition: exampleWorkweekPatternRecord,
          actor: systemActor,
        })
      }).toThrow(PatternUpdateSameValueError)
    })
    it('should not allow to update a reference work week pattern with invalid slots', () => {
      const { workschedulePatternRecordId } =
        aggregate.defineNewWorkweekTimeSlotsPatternRecord({
          name: 'Invalid Work Week',
          description: 'Invalid work week',
          workschedulePatternDefinition: {
            monday: {
              timeslots: [{ startTime: '10:00', endTime: '11:00' }],
              isJourOuvrable: true,
              isJourOuvre: true,
            },
            tuesday: {
              timeslots: [],
              isJourOuvrable: true,
              isJourOuvre: true,
            },
            wednesday: {
              timeslots: [],
              isJourOuvrable: true,
              isJourOuvre: true,
            },
            thursday: {
              timeslots: [],
              isJourOuvrable: true,
              isJourOuvre: true,
            },
            friday: {
              timeslots: [],
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
          actor: systemActor,
        })

      expect(() => {
        aggregate.updateWorkweekPatternRecord({
          workschedulePatternRecordId,
          name: 'Invalid Work Week',
          description: 'Invalid work week',
          workschedulePatternDefinition: {
            monday: {
              timeslots: [
                { startTime: '10:00', endTime: '11:00' },
                { startTime: '11:00', endTime: '12:00' },
                { startTime: '12:00', endTime: '13:00' },
              ],
              isJourOuvrable: true,
              isJourOuvre: true,
            },
            tuesday: {
              timeslots: [],
              isJourOuvrable: true,
              isJourOuvre: true,
            },
            wednesday: {
              timeslots: [],
              isJourOuvrable: true,
              isJourOuvre: true,
            },
            thursday: {
              timeslots: [],
              isJourOuvrable: true,
              isJourOuvre: true,
            },
            friday: {
              timeslots: [],
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
          actor: systemActor,
        })
      }).toThrow(PatternDefinitionInvalidSlotsSizeError)
    })
  })

  describe('defineNewWorkweekDayPatternRecord', () => {
    it('should create a new work week day pattern', () => {
      const exampleWorkweekDayPatternDefinition: WorkweekDayPatternDefinition =
        {
          monday: {
            isJourOuvrable: true,
            isJourOuvre: true,
            planned: true,
          },
          tuesday: {
            isJourOuvrable: true,
            isJourOuvre: true,
            planned: true,
          },
          wednesday: {
            isJourOuvrable: true,
            isJourOuvre: true,
            planned: true,
          },
          thursday: {
            isJourOuvrable: true,
            isJourOuvre: true,
            planned: true,
          },
          friday: {
            isJourOuvrable: true,
            isJourOuvre: true,
            planned: true,
          },
          saturday: {
            isJourOuvrable: true,
            isJourOuvre: true,
            planned: false,
          },
          sunday: {
            isJourOuvrable: true,
            isJourOuvre: true,
            planned: false,
          },
        }
      const { workschedulePatternRecordId } =
        aggregate.defineNewWorkweekDayPatternRecord({
          name: 'Standard Work Week',
          description: 'Standard 5 days work week',
          workweekDayPatternDefinition: exampleWorkweekDayPatternDefinition,
          actor: systemActor,
        })

      expect(aggregate.getPatternById(workschedulePatternRecordId)).toEqual(
        new WorkweekDayPatternRecord({
          id: workschedulePatternRecordId,
          name: 'Standard Work Week',
          description: 'Standard 5 days work week',
          definition: exampleWorkweekDayPatternDefinition,
        }),
      )
    })

    it('should not allow to create a new reference work week pattern with the same name', () => {
      const exampleWorkweekDayPatternDefinition: WorkweekDayPatternDefinition =
        {
          monday: {
            isJourOuvrable: true,
            isJourOuvre: true,
            planned: true,
          },
          tuesday: {
            isJourOuvrable: true,
            isJourOuvre: true,
            planned: true,
          },
          wednesday: {
            isJourOuvrable: true,
            isJourOuvre: true,
            planned: true,
          },
          thursday: {
            isJourOuvrable: true,
            isJourOuvre: true,
            planned: true,
          },
          friday: {
            isJourOuvrable: true,
            isJourOuvre: true,
            planned: true,
          },
          saturday: {
            isJourOuvrable: true,
            isJourOuvre: true,
            planned: false,
          },
          sunday: {
            isJourOuvrable: true,
            isJourOuvre: true,
            planned: false,
          },
        }
      aggregate.defineNewWorkweekDayPatternRecord({
        name: 'Standard Work Week',
        description: 'Standard 5 days work week',
        workweekDayPatternDefinition: exampleWorkweekDayPatternDefinition,
        actor: systemActor,
      })

      expect(() => {
        aggregate.defineNewWorkweekDayPatternRecord({
          name: 'Standard Work Week',
          description: 'Standard 5 days work week',
          workweekDayPatternDefinition: exampleWorkweekDayPatternDefinition,
          actor: systemActor,
        })
      }).toThrow(PatternNameAlreadyExistError)
    })
  })

  describe('updateWorkweekDayPatternRecord', () => {
    it('should update an existing pattern', () => {
      const exampleWorkweekDayPatternRecord: WorkweekDayPatternDefinition = {
        monday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          planned: true,
        },
        tuesday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          planned: true,
        },
        wednesday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          planned: true,
        },
        thursday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          planned: true,
        },
        friday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          planned: false,
        },
        saturday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          planned: false,
        },
        sunday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          planned: false,
        },
      }
      const { workschedulePatternRecordId } =
        aggregate.defineNewWorkweekDayPatternRecord({
          name: 'Standard Work Week',
          description: 'Standard 5 days work week',
          workweekDayPatternDefinition: exampleWorkweekDayPatternRecord,
          actor: systemActor,
        })

      const updatedPattern: WorkweekDayPatternDefinition = {
        monday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          planned: false,
        },
        tuesday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          planned: true,
        },
        wednesday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          planned: false,
        },
        thursday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          planned: true,
        },
        friday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          planned: false,
        },
        saturday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          planned: false,
        },
        sunday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          planned: false,
        },
      }

      aggregate.updateWorkweekDayPatternRecord({
        workschedulePatternRecordId,
        name: 'Updated Work Week',
        description: 'Updated standard work week',
        workweekDayPatternDefinition: updatedPattern,
        actor: systemActor,
      })

      expect(aggregate.getPatternById(workschedulePatternRecordId)).toEqual(
        new WorkweekDayPatternRecord({
          id: workschedulePatternRecordId,
          name: 'Updated Work Week',
          description: 'Updated standard work week',
          definition: updatedPattern,
        }),
      )
    })
    it('should throw error when updating non-existing pattern', () => {
      const updatedPattern: WorkweekDayPatternDefinition = {
        monday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          planned: false,
        },
        tuesday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          planned: true,
        },
        wednesday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          planned: false,
        },
        thursday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          planned: true,
        },
        friday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          planned: false,
        },
        saturday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          planned: false,
        },
        sunday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          planned: false,
        },
      }

      expect(() => {
        aggregate.updateWorkweekDayPatternRecord({
          workschedulePatternRecordId: 'non-existing-id',
          name: 'Updated Work Week',
          description: 'Updated standard work week',
          workweekDayPatternDefinition: updatedPattern,
          actor: systemActor,
        })
      }).toThrow(PatternNotFoundError)
    })

    it('should not update when no changes are provided', () => {
      const exampleWorkweekDayPatternRecord: WorkweekDayPatternDefinition = {
        monday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          planned: true,
        },
        tuesday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          planned: true,
        },
        wednesday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          planned: true,
        },
        thursday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          planned: true,
        },
        friday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          planned: true,
        },
        saturday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          planned: false,
        },
        sunday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          planned: true,
        },
      }

      const { workschedulePatternRecordId } =
        aggregate.defineNewWorkweekDayPatternRecord({
          name: 'Standard Work Week',
          description: 'Standard 5 days work week',
          workweekDayPatternDefinition: exampleWorkweekDayPatternRecord,
          actor: systemActor,
        })

      expect(() => {
        aggregate.updateWorkweekDayPatternRecord({
          workschedulePatternRecordId: workschedulePatternRecordId,
          name: 'Standard Work Week',
          description: 'Standard 5 days work week',
          workweekDayPatternDefinition: exampleWorkweekDayPatternRecord,
          actor: systemActor,
        })
      }).toThrow(PatternUpdateSameValueError)
    })
  })

  describe('defineNewWorkweekHalfDaysPatternRecord', () => {
    it('should create a new work week half days pattern', () => {
      const exampleWorkweekHalfDaysPatternDefinition: WorkweekHalfDaysPatternDefinition =
        {
          monday: {
            isJourOuvrable: true,
            isJourOuvre: true,
            morning: {
              planned: true,
            },
            afternoon: {
              planned: true,
            },
          },
          tuesday: {
            isJourOuvrable: true,
            isJourOuvre: true,
            morning: {
              planned: true,
            },
            afternoon: {
              planned: true,
            },
          },
          wednesday: {
            isJourOuvrable: true,
            isJourOuvre: true,
            morning: {
              planned: true,
            },
            afternoon: {
              planned: true,
            },
          },
          thursday: {
            isJourOuvrable: true,
            isJourOuvre: true,
            morning: {
              planned: true,
            },
            afternoon: {
              planned: true,
            },
          },
          friday: {
            isJourOuvrable: true,
            isJourOuvre: true,
            morning: {
              planned: true,
            },
            afternoon: {
              planned: true,
            },
          },
          saturday: {
            isJourOuvrable: true,
            isJourOuvre: true,
            morning: {
              planned: true,
            },
            afternoon: {
              planned: true,
            },
          },
          sunday: {
            isJourOuvrable: true,
            isJourOuvre: true,
            morning: {
              planned: true,
            },
            afternoon: {
              planned: true,
            },
          },
        }
      const { workschedulePatternRecordId } =
        aggregate.defineNewWorkweekHalfDaysPatternRecord({
          name: 'Standard Work Week',
          description: 'Standard 5 days work week',
          workweekHalfDaysPatternDefinition:
            exampleWorkweekHalfDaysPatternDefinition,
          actor: systemActor,
        })

      expect(aggregate.getPatternById(workschedulePatternRecordId)).toEqual(
        new WorkweekHalfDaysPatternRecord({
          id: workschedulePatternRecordId,
          name: 'Standard Work Week',
          description: 'Standard 5 days work week',
          definition: exampleWorkweekHalfDaysPatternDefinition,
        }),
      )
    })
  })

  describe('updateWorkweekHalfDaysPatternRecord', () => {
    it('should update an existing pattern', () => {
      const exampleWorkweekHalfDaysPatternRecord: WorkweekHalfDaysPatternDefinition =
        {
          monday: {
            isJourOuvrable: true,
            isJourOuvre: true,
            morning: {
              planned: true,
            },
            afternoon: {
              planned: true,
            },
          },
          tuesday: {
            isJourOuvrable: true,
            isJourOuvre: true,
            morning: {
              planned: true,
            },
            afternoon: {
              planned: true,
            },
          },
          wednesday: {
            isJourOuvrable: true,
            isJourOuvre: true,
            morning: {
              planned: true,
            },
            afternoon: {
              planned: true,
            },
          },
          thursday: {
            isJourOuvrable: true,
            isJourOuvre: true,
            morning: {
              planned: true,
            },
            afternoon: {
              planned: true,
            },
          },
          friday: {
            isJourOuvrable: true,
            isJourOuvre: true,
            morning: {
              planned: true,
            },
            afternoon: {
              planned: true,
            },
          },
          saturday: {
            isJourOuvrable: true,
            isJourOuvre: true,
            morning: {
              planned: true,
            },
            afternoon: {
              planned: true,
            },
          },
          sunday: {
            isJourOuvrable: true,
            isJourOuvre: true,
            morning: {
              planned: true,
            },
            afternoon: {
              planned: true,
            },
          },
        }
      const { workschedulePatternRecordId } =
        aggregate.defineNewWorkweekHalfDaysPatternRecord({
          name: 'Standard Work Week',
          description: 'Standard 5 days work week',
          workweekHalfDaysPatternDefinition:
            exampleWorkweekHalfDaysPatternRecord,
          actor: systemActor,
        })

      const updatedPattern: WorkweekHalfDaysPatternDefinition = {
        monday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          morning: {
            planned: true,
          },
          afternoon: {
            planned: true,
          },
        },
        tuesday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          morning: {
            planned: true,
          },
          afternoon: {
            planned: true,
          },
        },
        wednesday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          morning: {
            planned: true,
          },
          afternoon: {
            planned: true,
          },
        },
        thursday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          morning: {
            planned: true,
          },
          afternoon: {
            planned: true,
          },
        },
        friday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          morning: {
            planned: true,
          },
          afternoon: {
            planned: true,
          },
        },
        saturday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          morning: {
            planned: true,
          },
          afternoon: {
            planned: true,
          },
        },
        sunday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          morning: {
            planned: true,
          },
          afternoon: {
            planned: true,
          },
        },
      }

      aggregate.updateWorkweekHalfDaysPatternRecord({
        workschedulePatternRecordId,
        name: 'Updated Work Week',
        description: 'Updated standard work week',
        workweekHalfDaysPatternDefinition: updatedPattern,
        actor: systemActor,
      })

      expect(aggregate.getPatternById(workschedulePatternRecordId)).toEqual(
        new WorkweekHalfDaysPatternRecord({
          id: workschedulePatternRecordId,
          name: 'Updated Work Week',
          description: 'Updated standard work week',
          definition: updatedPattern,
        }),
      )
    })
    it('should throw error when updating non-existing pattern', () => {
      const updatedPattern: WorkweekHalfDaysPatternDefinition = {
        monday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          morning: {
            planned: true,
          },
          afternoon: {
            planned: true,
          },
        },
        tuesday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          morning: {
            planned: true,
          },
          afternoon: {
            planned: true,
          },
        },
        wednesday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          morning: {
            planned: true,
          },
          afternoon: {
            planned: true,
          },
        },
        thursday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          morning: {
            planned: true,
          },
          afternoon: {
            planned: true,
          },
        },
        friday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          morning: {
            planned: true,
          },
          afternoon: {
            planned: true,
          },
        },
        saturday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          morning: {
            planned: true,
          },
          afternoon: {
            planned: true,
          },
        },
        sunday: {
          isJourOuvrable: true,
          isJourOuvre: true,
          morning: {
            planned: true,
          },
          afternoon: {
            planned: true,
          },
        },
      }

      expect(() => {
        aggregate.updateWorkweekHalfDaysPatternRecord({
          workschedulePatternRecordId: 'non-existing-id',
          name: 'Updated Work Week',
          description: 'Updated standard work week',
          workweekHalfDaysPatternDefinition: updatedPattern,
          actor: systemActor,
        })
      }).toThrow(PatternNotFoundError)
    })

    it('should not update when no changes are provided', () => {
      const exampleWorkweekHalfDaysPatternRecord: WorkweekHalfDaysPatternDefinition =
        {
          monday: {
            isJourOuvrable: true,
            isJourOuvre: true,
            morning: {
              planned: true,
            },
            afternoon: {
              planned: true,
            },
          },
          tuesday: {
            isJourOuvrable: true,
            isJourOuvre: true,
            morning: {
              planned: true,
            },
            afternoon: {
              planned: true,
            },
          },
          wednesday: {
            isJourOuvrable: true,
            isJourOuvre: true,
            morning: {
              planned: true,
            },
            afternoon: {
              planned: true,
            },
          },
          thursday: {
            isJourOuvrable: true,
            isJourOuvre: true,
            morning: {
              planned: true,
            },
            afternoon: {
              planned: true,
            },
          },
          friday: {
            isJourOuvrable: true,
            isJourOuvre: true,
            morning: {
              planned: true,
            },
            afternoon: {
              planned: true,
            },
          },
          saturday: {
            isJourOuvrable: true,
            isJourOuvre: true,
            morning: {
              planned: true,
            },
            afternoon: {
              planned: true,
            },
          },
          sunday: {
            isJourOuvrable: true,
            isJourOuvre: true,
            morning: {
              planned: true,
            },
            afternoon: {
              planned: true,
            },
          },
        }

      const { workschedulePatternRecordId } =
        aggregate.defineNewWorkweekHalfDaysPatternRecord({
          name: 'Standard Work Week',
          description: 'Standard 5 days work week',
          workweekHalfDaysPatternDefinition:
            exampleWorkweekHalfDaysPatternRecord,
          actor: systemActor,
        })

      expect(() => {
        aggregate.updateWorkweekHalfDaysPatternRecord({
          workschedulePatternRecordId: workschedulePatternRecordId,
          name: 'Standard Work Week',
          description: 'Standard 5 days work week',
          workweekHalfDaysPatternDefinition:
            exampleWorkweekHalfDaysPatternRecord,
          actor: systemActor,
        })
      }).toThrow(PatternUpdateSameValueError)
    })
  })
})
