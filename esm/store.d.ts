import { EventEmitter } from '@toba/tools';
import { Document, Query, Schema, Result, CollectionSchema } from '.';
import { DataType } from './types';
export declare enum AccessType {
    ReadWrite = "readwrite",
    ReadOnly = "readonly",
    Upgrade = "versionchange"
}
export declare enum DataEvent {
    Error = 0
}
/**
 * IndexedDB uses object stores rather than tables and a single database can
 * contain any number of object stores. Whenever a value is stored in an object
 * store, it is associated with a key. There are several different ways that a
 * key can be supplied depending on whether the object store uses a key path or
 * a key generator.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
 */
export declare class DataStore extends EventEmitter<DataEvent, any> {
    private schema;
    /**
     * The open database. It will be `null` if the database hasn't yet been
     * opened.
     */
    private db;
    constructor(schema: Schema);
    protected readonly name: string;
    protected readonly version: number;
    protected readonly collectionSchemas: CollectionSchema<any>[];
    private ensureDB;
    /**
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#Opening_a_database
     *
     * The most likely error condition is the user declining web app permission
     * to create a database.
     */
    open: () => Promise<void>;
    close(): void;
    private onError;
    /**
     * If the database exists and is the same version as requested then this
     * event will occur immediately after opening. Otherwise `onupgradeneeded`
     * will happen first.
     */
    private onSuccess;
    /**
     * If no previous version exists, all object stores and indexes should be
     * created in this method.
     *
     * If a previous version exists, it is only necessary to implement the
     * differences. Note that an object store cannot have its `keyPath` (primary
     * key) altered in place. Its data would need to be copied out and a new
     * object store created to hold those data.
     *
     * The normal `onsuccess` event will happen when the upgrade completes.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#Creating_or_updating_the_version_of_the_database
     */
    private upgrade;
    /**
     * Names of collections created within the data store.
     */
    collectionNames(): Promise<string[]>;
    indexNames(collectionID: string): Promise<string[]>;
    indexNames<T extends DataType>(schema: CollectionSchema<T>): Promise<string[]>;
    private objectStore;
    saveDocument: <T_1 extends DataType>(doc: Document<T_1>) => Promise<void>;
    deleteDocument: <T_1 extends DataType>(doc: Document<T_1>) => Promise<void>;
    getDocument<T extends DataType>(doc: Document<T>): Promise<Document<T>>;
    getDocument<T extends DataType>(collection: CollectionSchema<T>, id: string): Promise<Document<T>>;
    /**
     * Support `getDocument()` by normalizing the overloads.
     */
    private ensureDoc;
    /**
     * key range search
     * @see https://github.com/mdn/indexeddb-examples/blob/master/idbkeyrange/scripts/main.js
     *
     * compound query example
     * @see https://stackoverflow.com/a/15625231/6823622
     */
    query<T extends DataType>(q: Query<T>): Result<T>;
}
