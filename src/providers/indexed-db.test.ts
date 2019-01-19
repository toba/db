import '@toba/test';
import { itemSchema, orderSchema, schema } from './__mocks__/mock-schema';
import { IndexedDB } from './indexed-db';

const idb = new IndexedDB(schema);

test('creates a database with collections', async () => {
   const names = await idb.collectionNames();
   expect(names.sort()).toEqual(schema.collections.map(c => c.name).sort());
});
