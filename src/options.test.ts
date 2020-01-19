import '@toba/test'
import { MockItem, mockSchema, itemSchema } from './__mocks__/mock-schema'
import { Document, Collection } from './'
import { DataClient } from './client'

const client = new DataClient(mockSchema)
const items = new Collection<MockItem>(client, itemSchema)
const mockDoc = () =>
   new Document<MockItem>(items, {
      id: 'sku',
      name: 'name',
      description: 'desc',
      price: 3
   })

test('#set replaces all document values if no options provided', () => {
   const doc = mockDoc()

   expect(doc.data()).toHaveProperty('name', 'name')

   doc.setWithoutSaving({ name: 'changed' })

   expect(doc.data()).toHaveProperty('name', 'changed')
   // theoretically the type definitions shouldn't allow partial data to replace
   // complete data but type coercion in the method currently allows it
   expect(doc.data()).not.toHaveProperty('id')
})

test('#set only replaces given values if option merge=true', () => {
   const doc = mockDoc()
   doc.setWithoutSaving({ name: 'changed' }, { merge: true })

   expect(doc.data()).toHaveProperty('name', 'changed')
   // existing value is unchanged
   expect(doc.data()).toHaveProperty('id', 'sku')
})

test('#set only replaces specific fields if the mergeFields option is given', () => {
   const doc = mockDoc()
   doc.setWithoutSaving(
      { name: 'changed', description: 'new desc' },
      { mergeFields: ['name'] }
   )

   expect(doc.data()).toHaveProperty('name', 'changed')
   // provided value not changed because not listed
   expect(doc.data()).toHaveProperty('description', 'desc')
})
