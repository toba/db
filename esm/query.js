export var SortDirection;
(function (SortDirection) {
    SortDirection[SortDirection["Ascending"] = 0] = "Ascending";
    SortDirection[SortDirection["Descending"] = 1] = "Descending";
})(SortDirection || (SortDirection = {}));
/**
 * A `Query` refers to a Query which you can read or listen to. You can also
 * construct refined `Query` objects by adding filters and ordering.
 * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Query
 */
export class Query {
    /**
     * @param collection Collection the query will run against
     */
    constructor(collection) {
        this.max = 0;
        this.sort = {};
        this.match = {};
        this.range = {};
        /**
         * Executes the query and returns the results.
         * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Query.html#get
         */
        this.get = () => this.collection.client.query(this);
        this.collection = collection;
    }
    /**
     * Creates a new query where the results end at the provided document
     * (inclusive). The end position is relative to the order of the query. The
     * document must contain all of the fields provided in the `orderBy` of this
     * query.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Query.html#endat
     */
    endAt(value) {
        this.range.endAt = value;
        return this;
    }
    /**
     * Creates a new query where the results end before the provided document
     * (exclusive). The end position is relative to the order of the query. The
     * document must contain all of the fields provided in the `orderBy` of this
     * query.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Query.html#endBefore
     */
    endBefore(value) {
        this.range.endBefore = value;
        return this;
    }
    /**
     * Creates a new query where the results are limited to the specified number
     * of documents.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Query.html#limit
     */
    limit(count) {
        this.max = count;
        return this;
    }
    /**
     * Creates a new query where the results are sorted by the specified field,
     * in descending or ascending order.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Query.html#orderBy
     */
    orderBy(fieldName, direction = SortDirection.Ascending) {
        this.sort.field = fieldName;
        this.sort.direction = direction;
        return this;
    }
    /**
     * Creates a new query where the results start after the provided document
     * (exclusive). The starting position is relative to the order of the query.
     * The document must contain all of the fields provided in the `orderBy` of
     * this query.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Query.html#startAfter
     */
    startAfter(value) {
        this.range.startAfter = value;
        return this;
    }
    /**
     * Creates a new query where the results start after the provided document
     * (inclusive). The starting position is relative to the order of the query.
     * The document must contain all of the fields provided in the `orderBy` of
     * this query.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Query.html#startAfter
     */
    startAt(value) {
        this.range.startAt = value;
        return this;
    }
    where(fieldName, operator, value) {
        this.match.field = fieldName;
        this.match.operator = operator;
        this.match.value = value;
        return this;
    }
}
