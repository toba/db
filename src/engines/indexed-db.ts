import { Database } from '../';
import { Engine } from './types';

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
 */
export const IndexedDB: Engine = {
   /**
    * The version number is an unsigned `long` number, which means that it can
    * be a very big integer. It also means that you can't use a `float`,
    * otherwise it will be converted to the closest lower integer and the
    * transaction may not start, nor the upgradeneeded event trigger. So for
    * example, don't use `2.4` as a version number.
    */
   open: (name: string, version?: number): Promise<Database> =>
      new Promise((resolve, reject) => {
         const req = indexedDB.open(name, version);
         req.onerror = event => {
            reject(event);
         };
         req.onsuccess = event => {
            const idb = event!.target.result as IDBDatabase;
            const db = new Database();

            resolve(db);
         };
      })
};
