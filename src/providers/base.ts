import { EventEmitter, is } from '@toba/tools';
import { Document, Collection, Result, Query, SetOptions } from '../';

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

   abstract saveDocument<T extends DataType>(
      doc: Document<T>,
      options?: SetOptions<T>
   ): Promise<void>;

   abstract getDocument<T extends DataType>(
      doc: Document<T>
   ): Promise<Document<T>>;

   abstract deleteDocument<T extends DataType>(doc: Document<T>): boolean;

   abstract query<T extends DataType>(q: Query<T>): Result<T>;
}

/**
 * An entity with access to a `DataProvider`.
 */
export abstract class DataEntity {
   public provider: DataProvider;

   constructor(provider: DataProvider) {
      this.provider = provider;
   }
}
