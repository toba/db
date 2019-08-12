import { Collection, Schema, Document } from './';
import { DataClient } from './client';
import { DataType, StoreEntity } from './types';
export declare class Database extends StoreEntity {
    /**
     * Schema that defines the collections, their data types and indexes.
     */
    private schema;
    constructor(client: DataClient, schema: Schema);
    open: () => Promise<void>;
    readonly name: string;
    readonly version: number;
    /**
     * Gets a `Collection` with the specified `id`.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Firestore#collection
     */
    collection<T extends DataType>(id: string): Promise<Collection<T>>;
    /**
     * Gets a Document instance that refers to the document with the specified
     * IDs.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Firestore#doc
     */
    doc<T extends DataType>(collectionID: string, docID: string): Promise<Document<T>>;
}
