import { CompanyDigestAggregate } from './company-digest.aggregate'
import { getEmptyCompanyDigestDatastore } from './company-digest.datastore'

describe('CompanyDigestAggregate', () => {
  const registryId = 'registry-1'

  let aggregate: CompanyDigestAggregate

  beforeEach(() => {
    aggregate = CompanyDigestAggregate.hydrate({
      id: registryId,
      initialState: getEmptyCompanyDigestDatastore([]),
      events: [],
    })
  })

  describe('initialization', () => {
    it('should create a new aggregate', () => {
      expect(aggregate).toBeDefined()
      expect(aggregate.id).toBe(registryId)
      expect(aggregate.hydrated).toBe(false)
    })
  })
})
