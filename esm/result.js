import { isEqualList } from '@toba/tools';
/**
 * A `Result` contains zero or more `Document` objects representing the results
 * of a query. The documents can be accessed as an array via the `docs` property
 * or enumerated using the `forEach` method. The number of documents can be
 * determined via the `empty` and `size` properties.
 * @see https://firebase.google.com/docs/reference/js/firebase.firestore.QuerySnapshot
 */
export class Result {
    constructor(query, matches) {
        this.query = query;
        this.matches = matches;
    }
    /**
     * Array of all documents in the result.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.QuerySnapshot#docs
     */
    docs() {
        return this.matches;
    }
    /**
     * True if there are no documents in the result.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.QuerySnapshot#empty
     */
    get empty() {
        return this.matches.length === 0;
    }
    /**
     * Number of matched documents.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.QuerySnapshot#size
     */
    get size() {
        return this.matches.length;
    }
    isEqual(other) {
        const docIDs = this.matches.map(d => d.id);
        const others = other.matches.map(d => d.id);
        return isEqualList(docIDs, others);
    }
}
