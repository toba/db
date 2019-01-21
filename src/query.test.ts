import '@toba/test';
import { mockSchema, itemSchema } from './__mocks__/mock-schema';
import { Collection, Query } from './';
import { IndexedDB } from './providers';

const idb = new IndexedDB(mockSchema);
const items = new Collection(idb, itemSchema);

test('supports limit condition', () => {
   const query = new Query(items);
   query.limit(5);

   expect(query).toBeDefined();
});
