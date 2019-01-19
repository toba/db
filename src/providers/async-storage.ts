import {
   Collection,
   Query,
   Result,
   Document,
   CollectionSchema,
   SetOptions
} from '../';
import { DataProvider, DataType } from './base';

export class AsyncStorage extends DataProvider {
   open(): Promise<void> {
      return Promise.resolve();
   }

   getCollection<T extends DataType>(
      schema: CollectionSchema<T>
   ): Promise<Collection<T>> {
      return Promise.reject();
   }

   getDocument<T extends DataType>(doc: Document<T>): Promise<Document<T>> {
      //return new Promise.resolve(new Document());
      return Promise.reject();
   }

   saveDocument<T extends DataType>(
      doc: Document<T>,
      options?: SetOptions<T>
   ): Promise<void> {
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
