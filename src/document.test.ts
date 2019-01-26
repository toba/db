import '@toba/test';
import {
   MockOrder,
   mockSchema,
   itemSchema,
   orderSchema
} from './__mocks__/mock-schema';
import { MockAsyncStorage } from './providers/__mocks__/mock-async-storage';
import { Document, Collection } from './';
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
   const orders = new Collection(provider, orderSchema);
   const mockDoc = (id = 'sku', price = 1.5) =>
      new Document(items, {
         id,
         price,
         name: 'name',
         description: 'desc'
      });

   test('generates a ULID ID if none provided', () => {
      const doc = new Document(items);
      expect(doc.id).toBeDefined();
      expect(doc.id.length).toBe(26);
   });

   test('uses ID parameter if provided', () => {
      const doc = mockDoc('some-id');
      expect(doc.id).toBe('some-id');
   });

   test('uses data ID if provided', () => {
      const doc = mockDoc();
      expect(doc.id).toBe('sku');
   });

   test('generates ULID if data provided without ID', () => {
      const data: MockOrder = {
         itemID: 'sku',
         quantity: 4,
         on: new Date()
      };
      const doc = new Document(orders, data);
      expect(doc.id).toBeDefined();
      expect(doc.id.length).toBe(26);
   });

   test('retrieves individual field value', () => {
      const doc = mockDoc();
      expect(doc.get('id')).toBe('sku');
      expect(doc.get('price')).toBe(1.5);
   });

   test('can be exported as JSON string', () => {
      const doc = mockDoc();
      const json = JSON.stringify({
         id: 'sku',
         price: 1.5,
         name: 'name',
         description: 'desc'
      });
      expect(doc.toString()).toBe(json);
   });
}
