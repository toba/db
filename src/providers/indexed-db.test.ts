import '@toba/test';
import { itemSchema, orderSchema } from './__mocks__/mock-schema';
import { IndexedDB } from './indexed-db';

const idb = new IndexedDB('test');

test('creates a database', () => {
   expect(idb.open()).resolves.toEqual(4);
});

test('creates an object store', async () => {
   const items = await idb.getCollection(itemSchema);
   expect(items).toBeDefined();
});
