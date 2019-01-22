import '@toba/test';
import { mockSchema, itemSchema } from './__mocks__/mock-schema';
import { MockAsyncStorage } from './providers/__mocks__/mock-async-storage';
import { Collection, Query, SortDirection } from './';
import {
   IndexedDbProvider,
   AsyncStorageProvider,
   DataProvider
} from './providers';

beforeAll(() => {
   jest.mock('AsyncStorage', () => new MockAsyncStorage());
});

afterAll(() => {
   jest.unmock('AsyncStorage');
});

describe('IndexedDB', () => {
   common(new IndexedDbProvider(mockSchema));
});

describe('AsyncStorage', () => {
   common(new AsyncStorageProvider(mockSchema));
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
