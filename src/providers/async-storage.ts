import { Collection } from '../';
import { DataProvider, DataType } from './base';


export class AsyncStorage extends DataProvider {
   open(): Promise<void> {
      return Promise.resolve();
   }

   getCollection<T extends DataType>(
      name: string,
      primaryKey?: keyof T
   ): Promise<Collection<T>> {
      return Promise.reject();
   }

   addDocument<T extends DataType>(
      collectionName: string,
      data: T
   ): Promise<boolean> {
      return Promise.reject();
   }
}
