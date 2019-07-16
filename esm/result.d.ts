import { Document, Query } from './';
import { DataType } from './types';
/**
 * A `Result` contains zero or more `Document` objects representing the results
 * of a query. The documents can be accessed as an array via the `docs` property
 * or enumerated using the `forEach` method. The number of documents can be
 * determined via the `empty` and `size` properties.
 * @see https://firebase.google.com/docs/reference/js/firebase.firestore.QuerySnapshot
 */
export declare class Result<T extends DataType> {
    /**
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.QuerySnapshot#query
     */
    private query;
    private matches;
    constructor(query: Query<T>, matches: Document<T>[]);
    /**
     * Array of all documents in the result.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.QuerySnapshot#docs
     */
    docs(): Document<T>[];
    /**
     * True if there are no documents in the result.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.QuerySnapshot#empty
     */
    readonly empty: boolean;
    /**
     * Number of matched documents.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.QuerySnapshot#size
     */
    readonly size: number;
    isEqual(other: Result<T>): boolean;
}
