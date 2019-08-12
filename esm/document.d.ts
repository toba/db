import { DataType } from './types';
import { Collection, SetOptions } from './';
/**
 * Combined features of a FireStore `DocumentReference` and `DocumentSnapshot`.
 * The `Document` is a reference to the actual stored data which are accessed
 * with the `data()` method.
 *
 * A `Document` may exist without having any data (yet) in which case it is akin
 * to a reference.
 *
 * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentSnapshot
 * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference
 */
export declare class Document<T extends DataType> {
    /**
     * The document's identifier within its collection. This is the same value
     * contained within the data (`DataType`) itself.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference#id
     */
    id: string;
    /**
     * Collection this document belongs to.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference#parent
     */
    parent: Collection<T>;
    /**
     * All data contained by the document.
     */
    private values?;
    /**
     * Create an empty document. If no ID is provied than a ULID will be
     * generated.
     */
    constructor(parent: Collection<T>, id?: string);
    /**
     * Create a document containing the given data values. If the data don't
     * include an ID then a ULID will be generated.
     */
    constructor(parent: Collection<T>, data: T);
    /**
     * Whether the document exists in the data store.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentSnapshot#~exists
     */
    readonly exists: boolean;
    /**
     * Document data (plain object) or `undefined` if the document doesn't exist.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentSnapshot#data
     */
    data: () => T | undefined;
    /**
     * The value of the field `key` in the document data or `undefined` if it
     * doesn't exist.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentSnapshot#get
     */
    get: <K extends keyof T>(key: K) => T[K] | undefined;
    /**
     * Remove document data from the store.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference#delete
     */
    delete: () => Promise<void>;
    /**
     * Replace document data with new values. An error will be emitted if the
     * document doesn't yet exist.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference#update
     */
    update: (values: Partial<T>) => Promise<void>;
    /**
     * Save new document data. The document will be created if it doesn't exist.
     * Options may be passed to merge new values instead of completely replacing
     * existing values.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference#set
     */
    set(values: Partial<T>, options?: SetOptions<T>): Promise<void>;
    toString: () => string;
    /**
     * Set document values without saving them. This will typically only be used
     * by data providers.
     */
    setWithoutSaving(values: T | Partial<T>, options?: SetOptions<T>): this;
}
