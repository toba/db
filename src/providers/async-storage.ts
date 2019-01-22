import { addUnique } from '@toba/tools';
import { AsyncStorage } from 'react-native';
import { Query, Result, Document, CollectionSchema } from '../';
import { DataProvider, DataType } from './base';

const keyPattern = /^([A-Z0-9\-]{2,})::([A-Z0-9\-]{2,})::([A-Z0-9\-]{2,})$/i;

export interface Key {
   database: string;
   collection: string;
   document: string;
}

export function keyParts(key: string): Key | null {
   const parts = keyPattern.exec(key);
   return parts == null
      ? null
      : {
           database: parts[1],
           collection: parts[2],
           document: parts[3]
        };
}

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
      return keys.sort().reduce((names: string[], key: string) => {
         const parts = keyParts(key);
         if (parts !== null) {
            addUnique(names, parts.collection);
         }
         return names;
      }, []);
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
