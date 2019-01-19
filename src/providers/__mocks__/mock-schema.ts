import { Schema, CollectionSchema } from '../../';

interface Order {
   id: string;
   quantity: number;
}

interface Item {
   id: string;
   name: string;
   descreiption: string;
}

export const itemSchema: CollectionSchema<Item> = {
   name: 'items',
   indexes: [
      {
         field: 'name',
         unique: true
      }
   ]
};

export const orderSchema: CollectionSchema<Order> = {
   name: 'orders',
   indexes: [
      {
         field: 'quantity',
         unique: false
      }
   ]
};

export const schema: Schema = {
   name: 'mock',
   version: 1,
   collections: [orderSchema, itemSchema]
};
