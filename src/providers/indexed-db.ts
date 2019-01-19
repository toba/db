import {
   Collection,
   Document,
   Query,
   Result,
   SetOptions,
   CollectionSchema
} from '../';
import { DataProvider, DataEvent, DataType } from './base';

export enum AccessType {
   ReadWrite = 'readwrite',
   ReadOnly = 'readonly',
   Upgrade = 'versionchange'
}

/**
 * All object store data extends `DataType` which specifies `id` as the primary
 * key. By default, `id` is an automatically generated `ULID`.
 * @see https://github.com/ulid/javascript
 */
const createOptions: IDBObjectStoreParameters = {
   keyPath: 'id',
   autoIncrement: false
};

/**
 * IndexedDB uses object stores rather than tables, and a single database can
 * contain any number of object stores. Whenever a value is stored in an object
 * store, it is associated with a key. There are several different ways that a
 * key can be supplied depending on whether the object store uses a key path or
 * a key generator.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
 */
export class IndexedDB extends DataProvider {
   /**
    * The open database. It will be `null` if the database hasn't yet been
    * opened.
    */
   private db: IDBDatabase | null = null;

   /**
    * Cache of retrieved collections.
    */
   collections: Map<string, IDBObjectStore> = new Map();

   private ensureDB = (): Promise<IDBDatabase> =>
      this.db !== null
         ? Promise.resolve(this.db)
         : new Promise(async resolve => {
              await this.open();
              resolve(this.db!);
           });

   /**
    *
    * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#Opening_a_database
    *
    * The most likely error condition is the user declining web app permission
    * to create a database.
    */
   open = () =>
      new Promise<void>((resolve, reject) => {
         const req = indexedDB.open(this.schema.name, this.schema.version);

         req.onerror = this.onError(req, reject);
         req.onsuccess = this.onSuccess(req, resolve);
         req.onupgradeneeded = this.upgrade(req);
      });

   close() {
      if (this.db !== null) {
         this.db.close();
         this.db = null;
      }
   }

   private onError = (
      req: IDBOpenDBRequest,
      cb: (er: DOMException | null) => void
   ) => () => {
      this.db = null;
      cb(req.error);
      this.removeAll(DataEvent.Error);
   };

   private onSuccess = (req: IDBOpenDBRequest, cb: () => void) => () => {
      this.db = req.result;
      cb();

      this.db.onerror = (event: Event) => {
         // TODO: evaluate whether db should be closed
         this.emit(DataEvent.Error, event);
      };
   };

   /**
    * The database will already have the object stores from the previous version
    * of the database so you do not have to create these object stores again.
    * You only need to create any new object stores, or delete object stores
    * from the previous version that are no longer needed. If you need to change
    * an existing object store (e.g., to change the keyPath), then you must
    * delete the old object store and create it again with the new options.
    * (Note that this will delete the information in the object store! If you
    * need to save that information, you should read it out and save it
    * somewhere else before upgrading the database.)
    *
    * Trying to create an object store with a name that already exists (or
    * trying to delete an object store with a name that does not already exist)
    * will throw an error.
    *
    * If the `onupgradeneeded` event exits successfully, the `onsuccess` handler
    * of the open database request will then be triggered.
    *
    * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#Creating_or_updating_the_version_of_the_database
    */
   private upgrade = (req: IDBOpenDBRequest) => (ev: IDBVersionChangeEvent) => {
      const db = req.result;

      this.schema.collections.forEach(c => {
         db.createObjectStore(c.name, createOptions);
      });
   };

   /**
    * Names of collections created within the data store.
    */
   async collectionNames(): Promise<string[]> {
      const db = await this.ensureDB();
      const names: string[] = [];

      for (let i = 0; i < db.objectStoreNames.length; i++) {
         names.push(db.objectStoreNames.item(i)!);
      }
      return names;
   }

   private async objectStore<T extends DataType>(
      doc: Document<T>,
      access: AccessType = AccessType.ReadOnly
   ): Promise<IDBObjectStore> {
      const db = await this.ensureDB();
      const id = doc.parent.schema.name;
      return db.transaction(id, access).objectStore(id);
   }

   saveDocument = <T extends DataType>(
      doc: Document<T>,
      options?: SetOptions<T>
   ) =>
      new Promise<void>(async (resolve, reject) => {
         const os = await this.objectStore(doc, AccessType.ReadWrite);
         const req: IDBRequest<IDBValidKey> = os.add(doc.data());

         req.onsuccess = () => resolve();
         req.onerror = () => reject();
      });

   deleteDocument = <T extends DataType>(doc: Document<T>) =>
      new Promise<void>(async (resolve, reject) => {
         const os = await this.objectStore(doc, AccessType.ReadWrite);
         const req: IDBRequest = os.delete(doc.id);

         req.onsuccess = () => resolve();
         req.onerror = () => reject();
      });

   /**
    * Retrieve a single document. A new transaction will always be created to
    * save the document so this operation can always be read-only. Method will
    * return `undefined` if the document isn't found.
    */
   getDocument<T extends DataType>(doc: Document<T>): Promise<Document<T>>;
   getDocument<T extends DataType>(
      collection: CollectionSchema<T>,
      id: string
   ): Promise<Document<T>>;
   getDocument<T extends DataType>(
      docOrSchema: Document<T> | CollectionSchema<T>,
      id?: string
   ) {
      return new Promise<Document<T>>(async (resolve, reject) => {
         const doc = this.ensureDoc(docOrSchema, id);
         const os = await this.objectStore(doc);
         const req: IDBRequest<T> = os.get(doc.id);

         req.onsuccess = () => {
            if (req.result === undefined) {
               resolve(undefined);
            } else {
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
    * key range search https://github.com/mdn/indexeddb-examples/blob/master/idbkeyrange/scripts/main.js
    */
   query<T extends DataType>(q: Query<T>): Result<T> {
      return new Result(q, []);
   }
}
