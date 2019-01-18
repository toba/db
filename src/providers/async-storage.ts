import { Collection, Query, Result } from '../';
import { DataProvider, DataType } from './base';

export class AsyncStorage extends DataProvider {
   open(): Promise<void> {
      return Promise.resolve();
   }

   getCollection<T extends DataType>(
      id: string,
      primaryKey?: keyof T
   ): Promise<Collection<T>> {
      return Promise.reject();
   }

   addDocument<T extends DataType>(
      collectionID: string,
      data: T
   ): Promise<boolean> {
      return Promise.reject();
   }

   query<T extends DataType>(q: Query<T>): Result<T> {
      return new Result(q, []);
   }
}
