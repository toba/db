import { is } from '@toba/tools';
import { Collection, Document, Query, Result, SetOptions } from '../';
import { DataProvider, DataEvent, DataType } from './base';

// key range search https://github.com/mdn/indexeddb-examples/blob/master/idbkeyrange/scripts/main.js

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
 */
export class IndexedDB extends DataProvider {
   db: IDBDatabase | null = null;
   collections: Map<string, IDBObjectStore> = new Map();

   /**
    * The version number is an unsigned `long` number, which means that it can
    * be a very big integer. It also means that you can't use a `float`,
    * otherwise it will be converted to the closest lower integer and the
    * transaction may not start, nor the `upgradeneeded` event trigger. So for
    * example, don't use `2.4` as a version number.
    *
    * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#Opening_a_database
    */
   open() {
      return new Promise<void>((resolve, reject) => {
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
      });
   }

   /**
    * Collections in IndexedDB are called object stores.
    * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#Structuring_the_database
    */
   async getCollection<T>(
      name: string,
      primaryKey?: keyof T
   ): Promise<Collection<T>> {
      if (this.db === null) {
         await this.open();
      }
      const db = this.db!;

      if (!this.collections.has(name)) {
         const params =
            primaryKey === undefined
               ? primaryKey
               : ({
                    keyPath: primaryKey,
                    autoIncrement: true
                 } as IDBObjectStoreParameters);

         const os = db.createObjectStore(name, params);
         this.collections.set(name, os);
      }
      return new Collection(this, name);
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

   query<T extends DataType>(q: Query<T>): Result<T> {
      return new Result(q, []);
   }
}
