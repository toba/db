import '@toba/test';
import { MockItem, mockSchema, itemSchema } from './__mocks__/mock-schema';
import { Document, Collection } from './';
import { IndexedDB } from './providers';

const idb = new IndexedDB(mockSchema);
const items = new Collection<MockItem>(idb, itemSchema);

test('generates a ULID ID if none provided', () => {
   const doc = new Document<MockItem>(items);
   expect(doc.id).toBeDefined();
   expect(doc.id.length).toBe(26);
});

test('uses ID parameter if provided', () => {
   const doc = new Document<MockItem>(items, 'some-id');
   expect(doc.id).toBe('some-id');
});

test('uses data ID if provided', () => {
   const data: MockItem = {
      id: 'sku',
      name: 'name',
      description: 'desc'
   };
   const doc = new Document<MockItem>(items, data);
   expect(doc.id).toBe('sku');
});
