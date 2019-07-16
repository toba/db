import { StoreEntity } from './types';
/**
 * A reference to a transaction. The `Transaction` object passed to a
 * transaction's `updateFunction` provides the methods to read and write data
 * within the transaction context. See `Firestore.runTransaction()`.
 * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Transaction
 */
export class Transaction extends StoreEntity {
    /**
     * Deletes the document referred to by the provided DocumentReference.
     */
    delete(doc) {
        return doc.delete();
    }
    get(doc) {
        return Promise.resolve(doc.data());
    }
    set(doc, values, options) {
        return this;
    }
    update(doc, values) {
        return this;
    }
    /**
     * Execute a function for each document in a collection.
     */
    forEach(fn) {
        return;
    }
}
