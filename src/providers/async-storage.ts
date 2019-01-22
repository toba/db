import { AsyncStorage } from 'react-native';
import { Collection, Query, Result, Document, CollectionSchema } from '../';
import { DataProvider, DataType } from './base';

export class AsyncStorageProvider extends DataProvider {
   private db: AsyncStorage;

   open(): Promise<void> {
      return Promise.resolve();
   }

   getCollection<T extends DataType>(
      schema: CollectionSchema<T>
   ): Promise<Collection<T>> {
      return Promise.reject();
   }

   // overloads
   getDocument<T extends DataType>(doc: Document<T>): Promise<Document<T>>;
   getDocument<T extends DataType>(
      collection: CollectionSchema<T>,
      id: string
   ): Promise<Document<T>>;
   /**
    * Retrieve a single document. A new transaction will always be created to
    * save the document so this operation can always be read-only. Method will
    * return `undefined` if the document isn't found.
    */
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

   saveDocument<T extends DataType>(doc: Document<T>): Promise<void> {
      return Promise.resolve();
   }

   addDocument<T extends DataType>(
      collectionID: string,
      data: T
   ): Promise<boolean> {
      return Promise.reject();
   }

   deleteDocument<T extends DataType>(doc: Document<T>): Promise<void> {
      return Promise.resolve();
   }

   query<T extends DataType>(q: Query<T>): Result<T> {
      return new Result(q, []);
   }
}
