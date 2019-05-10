import '@toba/test';
import { mockSchema, itemSchema } from './__mocks__/mock-schema';
import { Collection, Query, SortDirection } from './';
import { IndexedDbProvider, DataProvider } from './providers';

describe('IndexedDB', () => {
   common(new IndexedDbProvider(mockSchema));
});

function common(provider: DataProvider) {
   const items = new Collection(provider, itemSchema);

   test('supports limit condition', () => {
      const query = new Query(items);
      query.limit(5);
      expect(query.max).toBe(5);
   });

   test('supports sorting', () => {
      const query = new Query(items);
      query.orderBy('name');
      expect(query.sort.field).toBe('name');
      expect(query.sort.direction).toBe(SortDirection.Ascending);
   });

   test('supports reverse sorting', () => {
      const query = new Query(items);
      query.orderBy('name', SortDirection.Descending);
      expect(query.sort.direction).toBe(SortDirection.Descending);
   });

   test('supports conditions', () => {
      const query = new Query(items);
      query.where('name', '==', 'fred');
      expect(query.match).toEqual({
         field: 'name',
         operator: '==',
         value: 'fred'
      });
   });
}
