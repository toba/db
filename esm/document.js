import { is, merge } from '@toba/tools';
import { ulid } from 'ulid';
/**
 * Combined features of a FireStore `DocumentReference` and `DocumentSnapshot`.
 * The `Document` is a reference to the actual stored data which are accessed
 * with the `data()` method.
 *
 * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentSnapshot
 * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference
 */
export class Document {
    constructor(parent, dataOrID) {
        /**
         * Document data (plain object) or `undefined` if the document doesn't exist.
         * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentSnapshot#data
         */
        this.data = () => this.values;
        /**
         * The value of the field `key` in the document data or `undefined` if it
         * doesn't exist.
         * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentSnapshot#get
         */
        this.get = (key) => this.values !== undefined ? this.values[key] : this.values;
        /**
         * Remove document data from the store.
         * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference#delete
         */
        this.delete = () => this.parent.store.deleteDocument(this)
            ? Promise.resolve()
            : Promise.reject();
        /**
         * Replace document data with new values. An error will be emitted if the
         * document doesn't yet exist.
         * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference#update
         */
        this.update = (values) => this.values === undefined
            ? Promise.reject()
            : this.set(values, { merge: true });
        this.toString = () => JSON.stringify(this.values);
        let id = ulid();
        if (is.object(dataOrID)) {
            if (is.empty(dataOrID.id)) {
                dataOrID.id = id;
            }
            else {
                id = dataOrID.id;
            }
            this.values = dataOrID;
        }
        else if (!is.empty(dataOrID)) {
            id = dataOrID;
        }
        this.parent = parent;
        this.id = id;
    }
    /**
     * Whether the document exists in the data store.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentSnapshot#~exists
     */
    get exists() {
        return is.value(this.values);
    }
    /**
     * Save new document data. The document will be created if it doesn't exist.
     * Options may be passed to merge new values instead of completely replacing
     * existing values.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference#set
     */
    set(values, options) {
        this.setWithoutSaving(values, options);
        return this.parent.store.saveDocument(this);
    }
    /**
     * Set document values without saving them. This will typically only be used
     * by data providers.
     */
    setWithoutSaving(values, options) {
        if (values.id !== undefined && values.id !== this.id) {
            throw new Error(`Document ID "${this.id}" does not match data ID "${values.id}"`);
        }
        if (this.values === undefined || options === undefined) {
            // TODO: way to do this without type coercion?
            this.values = values;
        }
        else if (options !== undefined) {
            if (is.array(options.mergeFields)) {
                // only merge the listed fields
                const selected = {};
                options.mergeFields.forEach(f => {
                    selected[f] = values[f];
                });
                this.values = merge(this.values, selected);
            }
            else if (options.merge === true) {
                // merge given values but otherwise leave existing data as is
                this.values = merge(this.values, values);
            }
        }
        return this;
    }
}
