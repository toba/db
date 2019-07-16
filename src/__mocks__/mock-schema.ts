import { Schema, CollectionSchema } from '../';
import { DataType } from '../types';

export interface MockOrder extends DataType {
   itemID: string;
   on: Date;
   quantity: number;
}

export interface MockItem extends DataType {
   name: string;
   description: string;
   price: number;
}

export const itemSchema: CollectionSchema<MockItem> = {
   name: 'items',
   indexes: [
      {
         field: 'name',
         unique: true
      }
   ]
};

export const orderSchema: CollectionSchema<MockOrder> = {
   name: 'orders',
   indexes: [
      {
         field: 'itemID',
         unique: false
      }
   ]
};

export const mockSchema: Schema = {
   name: 'mock',
   version: 1,
   collections: [orderSchema, itemSchema]
};
