import { Collection } from './';
import { StoreEntity } from './types';
export class Database extends StoreEntity {
    constructor(client, schema) {
        super(client);
        this.open = () => this.client.open();
        this.schema = schema;
    }
    get name() {
        return this.schema.name;
    }
    get version() {
        return this.schema.version;
    }
    /**
     * Gets a `Collection` with the specified `id`.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Firestore#collection
     */
    async collection(id) {
        const schema = this.schema.collections.find(c => c.name == id);
        if (schema === undefined) {
            return Promise.reject(`Collection "${id}" does not exist in database ${this.name}`);
        }
        // type coercion is needed because the type-specific schemas in
        // .collections are all stored as CollectionSchema<DataType>
        return new Collection(this.client, schema);
    }
    /**
     * Gets a Document instance that refers to the document with the specified
     * IDs.
     * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Firestore#doc
     */
    async doc(collectionID, docID) {
        const c = await this.collection(collectionID);
        return c.doc(docID);
    }
}
