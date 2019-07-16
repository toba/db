import '@toba/test';
import {
   MockItem,
   MockOrder,
   mockSchema,
   itemSchema,
   orderSchema
} from './__mocks__/mock-schema';
import { Collection } from './';
import { DataStore } from './store';

let store: DataStore;
let itemCollection: Collection<MockItem>;
let orderCollection: Collection<MockOrder>;

beforeEach(() => {
   store = new DataStore(mockSchema);
   itemCollection = new Collection(store, itemSchema);
   orderCollection = new Collection(store, orderSchema);
});

test('creates a database with collections', async () => {
   const names = await store.collectionNames();
   const created = mockSchema.collections.map(c => c.name).sort();

   expect(names.sort()).toEqual(created);
});

test('creates indexes', async () => {
   const names = await store.indexNames(itemSchema);
   const indexes = itemSchema.indexes!.map(c => c.field).sort();

   expect(names).toHaveLength(1);
   expect(names.sort()).toEqual(indexes);
});

test('saves documents in a collection', async () => {
   const doc = await itemCollection.add({
      id: 'sku',
      price: 0,
      name: 'peanut butter',
      description: 'favorite'
   });

   expect(doc.data()).toHaveProperty('id', doc.id);

   await store.saveDocument(doc);

   const saved = await store.getDocument(doc);
   expect(saved.data()).toBeDefined();
   expect(saved.data()).toEqual(doc.data());
});

test('documents can be retrieved by ID and collection schema', async () => {
   const doc = await itemCollection.add({
      id: 'sku2',
      price: 0,
      name: 'chocolate',
      description: 'favorite'
   });

   expect(doc.data()).toHaveProperty('id', doc.id);

   await store.saveDocument(doc);

   const saved = await store.getDocument(itemSchema, doc.id);
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

   await store.saveDocument(doc);
   await store.deleteDocument(doc);

   const saved = await store.getDocument(doc);
   expect(saved).toBeUndefined();
});
