import { Collection, Document, Query, Result, SetOptions } from '../';
import { DataProvider, DataEvent, DataType } from './base';
import { CollectionSchema } from '../schema';

export enum AccessType {
   ReadWrite = 'readwrite'
}

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
   db: IDBDatabase | null = null;

   /**
    * Cache of retrieved collections.
    */
   collections: Map<string, IDBObjectStore> = new Map();

   /**
    *
    * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#Opening_a_database
    *
    * The most likely error condition is the user declining web app permission
    * to create a database.
    */
   open = () =>
      new Promise<void>((resolve, reject) => {
         const req = indexedDB.open(this.name, this.version);

         req.onerror = () => {
            this.db = null;
            reject(req.error);
            this.removeAll(DataEvent.Error);
         };

         req.onsuccess = () => {
            this.db = req.result;
            resolve();

            this.db.onerror = (event: Event) => {
               this.emit(DataEvent.Error, event);
            };
         };

         req.onupgradeneeded = this.upgrade(req);
      });

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
      this.db = req.result;
      // Create an objectStore for this database
      //var objectStore = db.createObjectStore('name', { keyPath: 'myKey' });
   };

   /**
    * Collections in IndexedDB are called object stores.
    *
    * Object stores are created with a single call to `createObjectStore()`. The
    * method takes a name of the store, and a parameter object. Even though the
    * parameter object is optional, it is very important, because it lets you
    * define important optional properties and refine the type of object store
    * you want to create.
    * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#Structuring_the_database
    */
   async getCollection<T extends DataType>(
      schema: CollectionSchema<T>
   ): Promise<Collection<T>> {
      if (this.db === null) {
         await this.open();
      }
      const db = this.db!;

      if (!this.collections.has(name)) {
         const os = db.createObjectStore(name, {
            keyPath: 'id',
            autoIncrement: false
         });
         this.collections.set(name, os);
      }
      return new Collection(this, schema);
   }

   async addDocument<T extends DataType>(collectionID: string, data: T) {
      const os = this.collections.get(collectionID);

      if (os !== undefined) {
         os.add(JSON.stringify(data));
         return true;
      }
      return false;
   }

   saveDocument = <T extends DataType>(
      doc: Document<T>,
      options?: SetOptions<T>
   ): Promise<void> =>
      new Promise((resolve, reject) => {
         const os = this.collections.get(doc.parent.id);

         if (os === undefined) {
            reject();
            return;
         }

         const req: IDBRequest = os.add(doc.toString(), doc.id);
         req.onsuccess = () => {
            resolve();
         };
         req.onerror = () => {
            reject();
         };
      });

   deleteDocument<T extends DataType>(doc: Document<T>): boolean {
      const collectionID = doc.parent.id;
      const os = this.collections.get(collectionID);

      if (os !== undefined) {
         os.delete(doc.id);
         return true;
      }
      return false;
   }

   getDocument<T extends DataType>(doc: Document<T>): Promise<Document<T>> {
      return Promise.resolve(doc);
   }

   /**
    * key range search https://github.com/mdn/indexeddb-examples/blob/master/idbkeyrange/scripts/main.js
    */
   query<T extends DataType>(q: Query<T>): Result<T> {
      return new Result(q, []);
   }
}
