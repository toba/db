import { DataType, ExcludeID } from './types';
/**
 * Idempotent index name used to store and look-up the index in the data
 * provider.
 */
export declare const indexName: <T extends DataType>(index: Index<T>) => string;
export interface Index<T extends DataType> {
    /**
     * Field name or names to be indexed other than `id`.
     */
    field: ExcludeID<T> | (ExcludeID<T>[]);
    unique?: boolean;
}
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
