import '@toba/test';
import {
   MockItem,
   MockOrder,
   mockSchema,
   itemSchema,
   orderSchema
} from '../__mocks__/mock-schema';
import { IndexedDB } from './indexed-db';
import { Collection } from '../';

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

test('creates indexes', async () => {
   const names = await idb.indexNames(itemSchema);
   const indexes = itemSchema.indexes!.map(c => c.field).sort();

   expect(names).toHaveLength(1);
   expect(names.sort()).toEqual(indexes);
});

test('saves documents in a collection', async () => {
   const doc = await itemCollection.add({
      id: 'sku',
      name: 'peanut butter',
      description: 'favorite'
   });

   expect(doc.data()).toHaveProperty('id', doc.id);

   await idb.saveDocument(doc);

   const saved = await idb.getDocument(doc);
   expect(saved.data()).toBeDefined();
   expect(saved.data()).toEqual(doc.data());
});

test('documents can be retrieved by ID and collection schema', async () => {
   const doc = await itemCollection.add({
      id: 'sku2',
      name: 'chocolate',
      description: 'favorite'
   });

   expect(doc.data()).toHaveProperty('id', doc.id);

   await idb.saveDocument(doc);

   const saved = await idb.getDocument(itemSchema, doc.id);
   expect(saved.data()).toBeDefined();
   expect(saved.data()).toEqual(doc.data());
});

test('documents can be deleted', async () => {
   const doc = await orderCollection.add({
      quantity: 5,
      itemID: 'sku2',
      on: new Date()
   });

   expect(doc.data()).toHaveProperty('itemID', doc.data().itemID);

   await idb.saveDocument(doc);
   await idb.deleteDocument(doc);

   const saved = await idb.getDocument(doc);
   expect(saved).toBeUndefined();
});
