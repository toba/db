import { MimeType } from '@toba/tools';
import { DataType } from './providers';

export interface Index<T extends DataType> {
   /** Field name to be indexed. */
   field: keyof T;
   unique: boolean;
}

// TODO: this is provider-specific
export interface Marshall<T extends DataType> {
   field: keyof T;
}

/**
 * Database schema.
 */
export interface Schema {
   /** Database name. */
   name: string;
   version: number;
   /** Document collections. */
   collections: CollectionSchema<DataType>[];
}

/**
 * Collection Schema defines the name and indexes for stored documents of a
 * particular type.
 */
export interface CollectionSchema<T extends DataType> {
   /** Collection name. */
   name: string;
   /** Fields that should be indexed. */
   indexes?: Index<T>[];
}


