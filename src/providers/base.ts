import { EventEmitter, is } from '@toba/tools';
import {
   Document,
   Collection,
   Result,
   Query,
   SetOptions,
   CollectionSchema
} from '../';

/**
 * Type of data stored in a `Document`.
 */
export interface DataType {
   /**
    * The primary key which should be a generated ULID.
    * @see https://github.com/ulid/javascript
    */
   id: string;
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
   /**
    * The version to open the database with. If the version is not provided and
    * the database exists, then a connection to the database will be opened
    * without changing its version. If the version is not provided and the
    * database does not exist, then it will be created with version 1
    * (IndexedDB documentation).
    * @see https://developer.mozilla.org/en-US/docs/Web/API/IDBFactory/open#Parameters
    */
   protected version: number;

   constructor(name: string, version: number = 1) {
      super();
      this.name = name;
      this.version = version;
   }

   abstract open(): Promise<void>;

   abstract getCollection<T extends DataType>(
      schema: CollectionSchema<T>
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
