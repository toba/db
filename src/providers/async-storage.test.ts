import '@toba/test';
import 'react-native';
import {
   MockItem,
   MockOrder,
   mockSchema,
   itemSchema,
   orderSchema
} from '../__mocks__/mock-schema';
import { MockAsyncStorage } from './__mocks__/mock-async-storage';
import { AsyncStorageProvider, keyParts, Key } from './async-storage';
import { Collection } from '../';

let asp: AsyncStorageProvider;
let itemCollection: Collection<MockItem>;
let orderCollection: Collection<MockOrder>;

// https://github.com/devmetal/mock-async-storage#usage
beforeAll(() => {
   jest.mock('AsyncStorage', () => new MockAsyncStorage());
});

beforeEach(() => {
   asp = new AsyncStorageProvider(mockSchema);
   itemCollection = new Collection(asp, itemSchema);
   orderCollection = new Collection(asp, orderSchema);
});

afterAll(() => {
   jest.unmock('AsyncStorage');
});

test('parses compound keys', () => {
   const keys = new Map<string, Key>([
      [
         'one::two::three',
         { database: 'one', collection: 'two', document: 'three' }
      ]
   ]);
   keys.forEach((value, key) => {
      expect(keyParts(key)).toEqual(value);
   });
});

test('saves documents in a collection', async () => {
   const doc = await itemCollection.add({
      id: 'sku',
      price: 0,
      name: 'peanut butter',
      description: 'favorite'
   });

   expect(doc.data()).toHaveProperty('id', doc.id);

   await asp.saveDocument(doc);

   const saved = await asp.getDocument(doc);
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

   await asp.saveDocument(doc);

   const saved = await asp.getDocument(itemSchema, doc.id);
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

   await asp.saveDocument(doc);
   await asp.deleteDocument(doc);

   const saved = await asp.getDocument(doc);
   expect(saved).toBeUndefined();
});

test('retrieves collection names', async () => {
   // AsyncProvider won't have collections until documents are saved
   await itemCollection.add(
      {
         id: 'sku2',
         price: 0,
         name: 'chocolate',
         description: 'favorite'
      },
      true
   );
   await orderCollection.add(
      {
         quantity: 5,
         itemID: 'sku2',
         on: new Date()
      },
      true
   );

   const names = await asp.collectionNames();
   const created = mockSchema.collections.map(c => c.name).sort();

   expect(names.sort()).toEqual(created);
});
