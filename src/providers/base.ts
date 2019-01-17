import { EventEmitter } from '@toba/tools';
import { Collection } from '../';

export interface DataType {
   [key: string]: any;
}

export enum DataEvent {
   Error
}

export abstract class DataProvider extends EventEmitter<DataEvent, any> {
   isOpen: boolean;
   protected name: string;
   protected version: number;

   constructor(name: string, version: number = 1) {
      super();
      this.name = name;
      this.version = version;
   }

   abstract open(): Promise<void>;

   abstract getCollection<T extends DataType>(
      name: string,
      primaryKey?: keyof T
   ): Promise<Collection<T>>;

   abstract addDocument<T extends DataType>(
      collectionName: string,
      data: T
   ): Promise<boolean>;
}

export abstract class DataEntity {
   protected provider: DataProvider;
   constructor(provider: DataProvider) {
      this.provider = provider;
   }
}
