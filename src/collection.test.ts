import '@toba/test';
import { is } from '@toba/tools';
import { mockSchema, itemSchema, orderSchema } from './__mocks__/mock-schema';
import { Collection } from './';
import { DataClient } from './client';

const client = new DataClient(mockSchema);
const items = new Collection(client, itemSchema);
const orders = new Collection(client, orderSchema);

test('retrieves schema name as ID', () => {
   expect(items.id).toBe(itemSchema.name);
   expect(orders.id).toBe(orderSchema.name);
});

test('creates document from data', () => {
   const doc = items.add({
      id: 'sku',
      name: 'three',
      price: 0,
      description: 'desc'
   });
   expect(doc).toBeDefined();
   expect(doc.id).toBe('sku');
});

test('creates and saves document from data', async () => {
   const p = items.add(
      {
         id: 'sku',
         name: 'three',
         price: 0,
         description: 'desc'
      },
      true
   );
   expect(is.promise(p)).toBe(true);

   const doc = await p;

   expect(doc.id).toBe('sku');
});
