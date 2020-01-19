import '@toba/test'
import { MockItem } from './__mocks__/mock-schema'
import { indexName, Index } from './'
import { ExcludeID } from './types'

type ItemKeys = ExcludeID<MockItem>

test('generates idempotent index name', () => {
   const fields = new Map<ItemKeys, ItemKeys[] | ItemKeys>([
      ['name', 'name'],
      ['name-price', ['name', 'price']],
      ['description-name', ['name', 'description']],
      ['description-name-price', ['price', 'name', 'description']]
   ])

   fields.forEach((field, name) => {
      const index: Index<MockItem> = { field }
      expect(indexName(index)).toBe(name)
   })
})
