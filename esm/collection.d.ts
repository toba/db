import { Document, Query, SortDirection, Operator, Boundary, CollectionSchema } from './';
import { DataStore } from './store';
import { DataType, StoreEntity } from './types';
export declare class Collection<T extends DataType> extends StoreEntity {
    schema: CollectionSchema<T>;
    /**
     * A reference to the containing `Document` if this is a subcollection. If
     * this isn't a subcollection, the reference is `null`.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#parent
     */
    parent: Document<T> | null;
    constructor(store: DataStore, schema: CollectionSchema<T>);
    readonly id: string;
    add<S extends boolean>(data: T): Document<T>;
    add<S extends boolean>(data: T, save: S): S extends true ? Promise<Document<T>> : Document<T>;
    /**
     * Creates a `Document` for the data within the collection having an ID. If
     * no ID is specified, an automatically-generated unique ID will be used to
     * create a new `Document`.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#doc
     */
    doc(id?: string): Promise<Document<T>>;
    /**
     * Creates a new query where the results end at the provided document
     * (inclusive). The end position is relative to the order of the query. The
     * document must contain all of the fields provided in the `orderBy` of this
     * query.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#endAt
     */
    endAt: (value: Boundary<T>) => Query<T>;
    /**
     * Creates a new query where the results end before the provided document
     * (exclusive). The end position is relative to the order of the query. The
     * document must contain all of the fields provided in the `orderBy` of this
     * query.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#endBefore
     */
    endBefore: (value: Boundary<T>) => Query<T>;
    /**
     * Executes the query and returns the results as a QuerySnapshot.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#get
     */
    /**
     * Returns `true` if this `Collection` is equal to the provided one.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#isEqual
     */
    isEqual: (other: Collection<T>) => boolean;
    /**
     * Creates a new query where the results are limited to the specified number
     * of documents.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#limit
     */
    limit: (count: number) => Query<T>;
    /**
     * Creates a new query where the results are sorted by the specified field,
     * in descending or ascending order.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#orderBy
     */
    orderBy: (fieldName: keyof T, direction?: SortDirection) => Query<T>;
    /**
     * Creates a new query where the results start after the provided document
     * (exclusive). The starting position is relative to the order of the query.
     * The document must contain all of the fields provided in the `orderBy` of
     * this query.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#startAfter
     */
    startAfter: (value: Boundary<T>) => Query<T>;
    /**
     * Creates a new query where the results start at the provided document
     * (inclusive). The starting position is relative to the order of the query.
     * The document must contain all of the fields provided in the `orderBy` of
     * the query.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#startAt
     */
    startAt: (value: Boundary<T>) => Query<T>;
    /**
     * Creates a new query that returns only documents that include the specified
     * fields and where the values satisfy the constraints provided.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#where
     */
    where: <K extends keyof T>(fieldName: K, operator: Operator, value: T[K]) => Query<T>;
}
