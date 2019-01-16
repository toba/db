import { Database, Collection } from '../';
import { Engine, EngineEvent, DataType } from './base';

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
 */
export class IndexedDB extends Engine {
   db: IDBDatabase | null = null;
   collections: Map<string, IDBObjectStore> = new Map();

   /**
    * The version number is an unsigned `long` number, which means that it can
    * be a very big integer. It also means that you can't use a `float`,
    * otherwise it will be converted to the closest lower integer and the
    * transaction may not start, nor the upgradeneeded event trigger. So for
    * example, don't use `2.4` as a version number.
    *
    * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#Opening_a_database
    */
   open(): Promise<void> {
      return new Promise((resolve, reject) => {
         const req = indexedDB.open(this.name, this.version);
         req.onerror = () => {
            this.db = null;
            reject(req.error);
            this.removeAll(EngineEvent.Error);
         };
         req.onsuccess = () => {
            this.db = req.result;
            resolve();

            this.db.onerror = (event: Event) => {
               this.emit(EngineEvent.Error, event);
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

   async addDocument<T extends DataType>(collectionName: string, data: T) {
      const os = this.collections.get(collectionName);
      if (os !== undefined) {
         os.add(JSON.stringify(data));
         return true;
      }
      return false;
   }
}
