import '@toba/test';
import {
   MockItem,
   MockOrder,
   mockSchema,
   itemSchema,
   orderSchema
} from './__mocks__/mock-schema';
import { IndexedDB } from './indexed-db';
import { Document, Collection } from '../';

let idb: IndexedDB;
let itemCollection: Collection<MockItem>;
let orderCollection: Collection<MockOrder>;

beforeEach(() => {
   idb = new IndexedDB(mockSchema);
   itemCollection = new Collection(idb, itemSchema);
   orderCollection = new Collection(idb, orderSchema);
});

test('creates a database with collections', async () => {
   const names = await idb.collectionNames();
   const created = mockSchema.collections.map(c => c.name).sort();

   expect(names.sort()).toEqual(created);
});

test('saves documents in a collection', async () => {
   const doc = await itemCollection.add({
      id: 'sku',
      name: 'peanut butter',
      description: 'favorite'
   });

   expect(doc.data()).toHaveProperty('id', 'sku');

   await idb.saveDocument(doc);

   const saved = await idb.getDocument(doc);
   expect(saved).toEqual(doc);
});
