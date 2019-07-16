import { is, EventEmitter } from '@toba/tools';
import { Document, Collection, Result, indexName } from '.';
import { domStringListToArray } from './tools';
export var AccessType;
(function (AccessType) {
    AccessType["ReadWrite"] = "readwrite";
    AccessType["ReadOnly"] = "readonly";
    AccessType["Upgrade"] = "versionchange";
})(AccessType || (AccessType = {}));
export var DataEvent;
(function (DataEvent) {
    DataEvent[DataEvent["Error"] = 0] = "Error";
})(DataEvent || (DataEvent = {}));
/**
 * All object store data extends `DataType` which specifies `id` as the primary
 * key. By default, `id` is an automatically generated `ULID`.
 * @see https://github.com/ulid/javascript
 */
const createOptions = {
    keyPath: 'id',
    autoIncrement: false
};
/**
 * IndexedDB uses object stores rather than tables and a single database can
 * contain any number of object stores. Whenever a value is stored in an object
 * store, it is associated with a key. There are several different ways that a
 * key can be supplied depending on whether the object store uses a key path or
 * a key generator.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
 */
export class DataStore extends EventEmitter {
    constructor(schema) {
        super();
        /**
         * The open database. It will be `null` if the database hasn't yet been
         * opened.
         */
        this.db = null;
        this.ensureDB = () => this.db !== null
            ? Promise.resolve(this.db)
            : new Promise(async (resolve) => {
                await this.open();
                resolve(this.db);
            });
        /**
         *
         * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#Opening_a_database
         *
         * The most likely error condition is the user declining web app permission
         * to create a database.
         */
        this.open = () => new Promise((resolve, reject) => {
            const req = indexedDB.open(this.name, this.version);
            req.onerror = this.onError(req, reject);
            req.onsuccess = this.onSuccess(req, resolve);
            req.onupgradeneeded = this.upgrade(req);
        });
        this.onError = (req, cb, closeDatabase = true) => () => {
            if (closeDatabase) {
                this.close();
            }
            cb(req.error);
            this.removeAll(DataEvent.Error);
        };
        /**
         * If the database exists and is the same version as requested then this
         * event will occur immediately after opening. Otherwise `onupgradeneeded`
         * will happen first.
         */
        this.onSuccess = (req, cb) => () => {
            this.db = req.result;
            cb();
            this.db.onerror = (event) => {
                // TODO: evaluate whether db should be closed
                this.emit(DataEvent.Error, event);
            };
        };
        /**
         * If no previous version exists, all object stores and indexes should be
         * created in this method.
         *
         * If a previous version exists, it is only necessary to implement the
         * differences. Note that an object store cannot have its `keyPath` (primary
         * key) altered in place. Its data would need to be copied out and a new
         * object store created to hold those data.
         *
         * The normal `onsuccess` event will happen when the upgrade completes.
         *
         * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#Creating_or_updating_the_version_of_the_database
         */
        this.upgrade = (req) => (_ev) => {
            const db = req.result;
            this.collectionSchemas.forEach(c => {
                const os = db.createObjectStore(c.name, createOptions);
                if (is.array(c.indexes)) {
                    c.indexes.forEach(i => {
                        // the index field is defined as keyOf DataType which requires
                        // string keys, yet still resolves as number | string, hence
                        // the coercion
                        os.createIndex(indexName(i), i.field, {
                            unique: i.unique
                        });
                    });
                }
            });
        };
        this.saveDocument = (doc) => new Promise(async (resolve, reject) => {
            const os = await this.objectStore(doc, AccessType.ReadWrite);
            const req = os.add(doc.data());
            req.onsuccess = () => resolve();
            req.onerror = () => reject();
        });
        this.deleteDocument = (doc) => new Promise(async (resolve, reject) => {
            const os = await this.objectStore(doc, AccessType.ReadWrite);
            const req = os.delete(doc.id);
            req.onsuccess = () => resolve();
            req.onerror = () => reject();
        });
        this.schema = schema;
    }
    get name() {
        return this.schema.name;
    }
    get version() {
        return this.schema.version;
    }
    get collectionSchemas() {
        return this.schema.collections;
    }
    close() {
        if (this.db !== null) {
            this.db.close();
            this.db = null;
        }
    }
    /**
     * Names of collections created within the data store.
     */
    async collectionNames() {
        const db = await this.ensureDB();
        return domStringListToArray(db.objectStoreNames);
    }
    /**
     * Names of all indexes in a collection.
     */
    async indexNames(schemaOrID) {
        const id = is.text(schemaOrID) ? schemaOrID : schemaOrID.name;
        const os = await this.objectStore(id);
        return domStringListToArray(os.indexNames);
    }
    /**
     * Create and return an object store transaction. If more than one object
     * store should participate in the transaction then the transaction and its
     * object stores should be created and retrieved step-by-step.
     */
    async objectStore(docOrID, access = AccessType.ReadOnly) {
        const db = await this.ensureDB();
        const id = is.text(docOrID) ? docOrID : docOrID.parent.id;
        return db.transaction(id, access).objectStore(id);
    }
    /**
     * Retrieve a single document. A new transaction will always be created to
     * save the document so this operation can always be read-only. Method will
     * return `undefined` if the document isn't found.
     */
    getDocument(docOrSchema, id) {
        return new Promise(async (resolve, reject) => {
            const doc = this.ensureDoc(docOrSchema, id);
            const os = await this.objectStore(doc);
            const req = os.get(doc.id);
            req.onsuccess = () => {
                if (req.result === undefined) {
                    resolve(undefined);
                }
                else {
                    doc.setWithoutSaving(req.result);
                    resolve(doc);
                }
            };
            req.onerror = () => {
                reject();
            };
        });
    }
    /**
     * Support `getDocument()` by normalizing the overloads.
     */
    ensureDoc(docOrSchema, id) {
        if (docOrSchema instanceof Document) {
            return docOrSchema;
        }
        else {
            const schema = docOrSchema;
            if (id === undefined) {
                throw Error(`No ID given to retrieve document from "${schema.name}" collection`);
            }
            const c = new Collection(this, schema);
            return new Document(c, id);
        }
    }
    /**
     * key range search
     * @see https://github.com/mdn/indexeddb-examples/blob/master/idbkeyrange/scripts/main.js
     *
     * compound query example
     * @see https://stackoverflow.com/a/15625231/6823622
     */
    query(q) {
        return new Result(q, []);
    }
}
