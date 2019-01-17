import { EventEmitter } from '@toba/tools';
import { Collection } from '../';

/**
 * Type of data stored in a `Document`.
 */
export interface DataType {
   [key: string]: any;
}

/**
 * Event emitted by a `DataProvider`.
 */
export enum DataEvent {
   Error
}

/**
 * Methods to access and manage data in a particular storage system.
 */
export abstract class DataProvider extends EventEmitter<DataEvent, any> {
   /**
    * Whether the data provider is open.
    */
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

/**
 * An entity with access to a `DataProvider`.
 */
export abstract class DataEntity {
   protected provider: DataProvider;
   constructor(provider: DataProvider) {
      this.provider = provider;
   }
}
