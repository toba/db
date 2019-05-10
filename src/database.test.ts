import '@toba/test';
import { mockSchema, itemSchema, MockItem } from './__mocks__/mock-schema';
import { Database } from './';
import { IndexedDbProvider, DataProvider } from './providers';

describe('IndexedDB', () => {
   common(new IndexedDbProvider(mockSchema));
});

function common(provider: DataProvider) {
   test('retrieves collection references', async () => {
      const db = new Database(provider, mockSchema);
      const c = await db.collection(itemSchema.name);

      expect(c).toBeDefined();
      expect(c.id).toBe(itemSchema.name);
   });

   test('throws error if trying to access non-existent collection', async () => {
      const db = new Database(provider, mockSchema);
      const badName = 'bad name';
      let err: Error | undefined;

      try {
         await db.collection(badName);
      } catch (e) {
         err = e;
      }
      expect(err).toBeDefined();
      expect(err).toBe(
         `Collection "${badName}" does not exist in database ${db.name}`
      );
   });

   test('retrieves document references', async () => {
      const db = new Database(provider, mockSchema);
      const c = await db.collection<MockItem>(itemSchema.name);
      const doc = await c.add(
         { id: 'sku', name: 'name', description: 'desc', price: 1 },
         true
      );
      const loaded = await db.doc<MockItem>(c.id, doc.id);

      expect(loaded).toBeDefined();
      expect(loaded.data()).toEqual(doc.data());
   });
}
