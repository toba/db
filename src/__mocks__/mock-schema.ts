import { Schema as MockSchema, CollectionSchema } from '../';
import { DataType } from '../providers/base';

export interface MockOrder extends DataType {
   itemID: string;
   on: Date;
   quantity: number;
}

export interface MockItem {
   id: string;
   name: string;
   description: string;
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

export const mockSchema: MockSchema = {
   name: 'mock',
   version: 1,
   collections: [orderSchema, itemSchema]
};
