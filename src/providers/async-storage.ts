import { AsyncStorage } from 'react-native';
import { Query, Result, Document, CollectionSchema } from '../';
import { DataProvider, DataType } from './base';

/**
 * `AsyncStorage` is a simple key-value data store. Documents will be stored
 * with a key that indicates their parent collection and database:
 * `<db-name>::<collection-name>::<doc-id>`.
 */
export class AsyncStorageProvider extends DataProvider {
   /**
    * `AsyncStorage` is globally available on React Native so `open()` is a
    * no-op.
    */
   open(): Promise<void> {
      return Promise.resolve();
   }

   close() {
      return;
   }

   /**
    * Retrieve key for a document.
    */
   private docKey = <T extends DataType>(doc: Document<T>) =>
      `${this.name}::${doc.parent.id}::${doc.id}`;

   async collectionNames() {
      const keys = await AsyncStorage.getAllKeys();
      return keys;
   }

   // overloads
   getDocument<T extends DataType>(doc: Document<T>): Promise<Document<T>>;
   getDocument<T extends DataType>(
      collection: CollectionSchema<T>,
      id: string
   ): Promise<Document<T>>;
   /**
    * Retrieve a single document. Method will return `undefined` if the document
    * isn't found.
    */
   async getDocument<T extends DataType>(
      docOrSchema: Document<T> | CollectionSchema<T>,
      id?: string
   ) {
      const doc = this.ensureDoc(docOrSchema, id);
      const key = this.docKey(doc);
      const value = await AsyncStorage.getItem(key);

      return value === null
         ? undefined
         : doc.setWithoutSaving(JSON.parse(value));
   }

   saveDocument<T extends DataType>(doc: Document<T>): Promise<void> {
      const key = this.docKey(doc);
      return AsyncStorage.setItem(key, doc.toString());
   }

   deleteDocument<T extends DataType>(doc: Document<T>): Promise<void> {
      const key = this.docKey(doc);
      return AsyncStorage.removeItem(key);
   }

   query<T extends DataType>(q: Query<T>): Result<T> {
      return new Result(q, []);
   }
}
