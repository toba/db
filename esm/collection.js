import { is } from '@toba/tools';
import { Document, Query, SortDirection } from './';
import { StoreEntity } from './types';
export class Collection extends StoreEntity {
    constructor(client, schema) {
        super(client);
        /**
         * Creates a new query where the results end at the provided document
         * (inclusive). The end position is relative to the order of the query. The
         * document must contain all of the fields provided in the `orderBy` of this
         * query.
         * @see https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#endAt
         */
        this.endAt = (value) => new Query(this).endAt(value);
        /**
         * Creates a new query where the results end before the provided document
         * (exclusive). The end position is relative to the order of the query. The
         * document must contain all of the fields provided in the `orderBy` of this
         * query.
         * @see https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#endBefore
         */
        this.endBefore = (value) => new Query(this).endBefore(value);
        /**
         * Executes the query and returns the results as a QuerySnapshot.
         * @see https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#get
         */
        // get(): Result<T> {
        //    return new Result(null, null);
        // }
        /**
         * Returns `true` if this `Collection` is equal to the provided one.
         * @see https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#isEqual
         */
        this.isEqual = (other) => this.id == other.id && this.schema.name == other.schema.name;
        /**
         * Creates a new query where the results are limited to the specified number
         * of documents.
         * @see https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#limit
         */
        this.limit = (count) => new Query(this).limit(count);
        /**
         * Creates a new query where the results are sorted by the specified field,
         * in descending or ascending order.
         * @see https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#orderBy
         */
        this.orderBy = (fieldName, direction = SortDirection.Ascending) => new Query(this).orderBy(fieldName, direction);
        /**
         * Creates a new query where the results start after the provided document
         * (exclusive). The starting position is relative to the order of the query.
         * The document must contain all of the fields provided in the `orderBy` of
         * this query.
         * @see https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#startAfter
         */
        this.startAfter = (value) => new Query(this).startAfter(value);
        /**
         * Creates a new query where the results start at the provided document
         * (inclusive). The starting position is relative to the order of the query.
         * The document must contain all of the fields provided in the `orderBy` of
         * the query.
         * @see https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#startAt
         */
        this.startAt = (value) => new Query(this).startAt(value);
        /**
         * Creates a new query that returns only documents that include the specified
         * fields and where the values satisfy the constraints provided.
         * @see https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#where
         */
        this.where = (fieldName, operator, value) => new Query(this).where(fieldName, operator, value);
        this.schema = schema;
    }
    get id() {
        return this.schema.name;
    }
    /**
     * Adds a new document to this collection with the specified data, assigning
     * it a document ID automatically if one is not provided in the data.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#add
     */
    add(data, save = false) {
        const doc = new Document(this, data);
        return save ? doc.set(data).then(() => doc) : doc;
    }
    /**
     * Creates a `Document` for the data within the collection having an ID. If
     * no ID is specified, an automatically-generated unique ID will be used to
     * create a new `Document`.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#doc
     */
    async doc(id) {
        if (is.empty(id)) {
            return new Document(this);
        }
        const doc = new Document(this, id);
        return this.client.getDocument(doc);
    }
}
