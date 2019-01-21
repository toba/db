import '@toba/test';
import {
   MockItem,
   MockOrder,
   mockSchema,
   itemSchema,
   orderSchema
} from './__mocks__/mock-schema';
import { Document, Collection } from './';
import { IndexedDB } from './providers';

const idb = new IndexedDB(mockSchema);
const items = new Collection(idb, itemSchema);
const orders = new Collection(idb, orderSchema);

test('generates a ULID ID if none provided', () => {
   const doc = new Document(items);
   expect(doc.id).toBeDefined();
   expect(doc.id.length).toBe(26);
});

test('uses ID parameter if provided', () => {
   const doc = new Document(items, 'some-id');
   expect(doc.id).toBe('some-id');
});

test('uses data ID if provided', () => {
   const data: MockItem = {
      id: 'sku',
      name: 'name',
      description: 'desc'
   };
   const doc = new Document(items, data);
   expect(doc.id).toBe('sku');
});

test('generates ULID if data provided without ID', () => {
   const data: MockOrder = {
      itemID: 'sku',
      quantity: 4,
      on: new Date()
   };
   const doc = new Document(orders, data);
   expect(doc.id).toBeDefined();
   expect(doc.id.length).toBe(26);
});
