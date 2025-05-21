import { EmployeeWorkscheduleRegistryAggregate } from './employee-workschedule-registry.aggregate'
import { EmployeeWorkscheduleRegistry } from './employee-workschedule-registry.entity'

describe('EmployeeWorkscheduleRegistryAggregate', () => {
  const registryId = 'registry-1'

  let aggregate: EmployeeWorkscheduleRegistryAggregate

  beforeEach(() => {
    aggregate = EmployeeWorkscheduleRegistryAggregate.hydrate({
      id: registryId,
      initialState: new EmployeeWorkscheduleRegistry(registryId),
      events: [],
    })
  })

  describe('initialization', () => {
    it('should create a new aggregate', () => {
      expect(aggregate).toBeDefined()
      expect(aggregate.id).toBe(registryId)
      expect(aggregate.dataStore.workschedulePatternAssociations.length).toBe(0)
      expect(aggregate.hydrated).toBe(false)
    })
  })

  describe('updateWorkschedulePatternAssociation', () => {
    const workschedulePatternRecordId = 'pattern-1'
    const workschedulePatternRegistryId = 'registry-1'
    const workschedulePatternRegistryVersion = 1

    beforeEach(() => {
      // First associate a pattern that we can then update
      aggregate.associateWorkschedulePattern({
        workschedulePatternRecordId,
        workschedulePatternRegistryId,
        workschedulePatternRegistryVersion,
        actor: {
          id: 'actor-1',
          name: 'Actor 1',
          role: 'admin',
        },
        validityPeriod: {
          startDate: '2024-01-01',
          endDate: '2024-01-01',
        },
      })
    })

    it('should update an existing pattern association version', () => {
      const newVersion = 2

      aggregate.updateWorkschedulePatternAssociation({
        workschedulePatternRecordId,
        workschedulePatternRegistryId,
        workschedulePatternRegistryVersion: newVersion,
        actor: {
          id: 'actor-1',
          name: 'Actor 1',
          role: 'admin',
        },
      })

      const updatedAssociation =
        aggregate.dataStore.workschedulePatternAssociations.find(
          (association) =>
            association.workschedulePatternRecordId ===
            workschedulePatternRecordId,
        )

      expect(updatedAssociation).toBeDefined()
      expect(updatedAssociation?.workschedulePatternRegistryVersion).toBe(
        newVersion,
      )
    })

    it('should throw PatternAssociationNotFoundError when pattern does not exist', () => {
      const nonExistentPatternId = 'non-existent'

      expect(() =>
        aggregate.updateWorkschedulePatternAssociation({
          workschedulePatternRecordId: nonExistentPatternId,
          workschedulePatternRegistryId,
          workschedulePatternRegistryVersion: 2,
          actor: {
            id: 'actor-1',
            name: 'Actor 1',
            role: 'admin',
          },
        }),
      ).toThrow('Pattern non-existent association not found')
    })
  })
})
