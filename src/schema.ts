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

   /**
    * The version to open the database with. If the version is not provided and
    * the database exists, then a connection to the database will be opened
    * without changing its version. If the version is not provided and the
    * database does not exist, then it will be created with version 1
    * (IndexedDB documentation).
    * @see https://developer.mozilla.org/en-US/docs/Web/API/IDBFactory/open#Parameters
    */
   version: number;

   /** Document collection schemas */
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
