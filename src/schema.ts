import { DataType, ExcludeID } from './types';
import { is } from '@toba/tools';

/**
 * Idempotent index name used to store and look-up the index in the data
 * provider.
 */
export const indexName = <T extends DataType>(index: Index<T>): string =>
   is.array(index.field)
      ? index.field.sort().join('-')
      : (index.field as string);

export interface Index<T extends DataType> {
   /** Field name or names to be indexed other than `id` */
   field: ExcludeID<T> | (ExcludeID<T>[]);
   /** Whether index vaiues should be unique */
   unique?: boolean;
}

// TODO: this is provider-specific
export interface Marshall<T extends DataType> {
   field: keyof T;
}

/**
 * Collection Schema defines the name and indexes for stored documents of a
 * particular type. It is conceptually equivalent to a table definition.
 */
export interface CollectionSchema<T extends DataType> {
   /** Collection name */
   name: string;
   /** Fields that should be indexed */
   indexes?: Index<T>[];
}

/**
 * Database schema.
 */
export interface Schema {
   /** Database name */
   name: string;

   /**
    * The version to open the database with. If the version is not provided and
    * the database exists then a connection to the database will be opened
    * without changing its version. If the version is not provided and the
    * database does not exist then it will be created with version 1
    * (IndexedDB documentation).
    * @see https://developer.mozilla.org/en-US/docs/Web/API/IDBFactory/open#Parameters
    */
   version: number;

   /** Document collection schemas */
   collections: CollectionSchema<any>[];
}
