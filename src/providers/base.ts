import { EventEmitter } from '@toba/tools';
import {
   Document,
   Collection,
   Result,
   Query,
   SetOptions,
   Schema,
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
   protected schema: Schema;

   constructor(schema: Schema) {
      super();
      this.schema = schema;
   }

   abstract open(): Promise<void>;

   abstract close(): void;

   abstract collectionNames(): Promise<string[]>;

   abstract saveDocument<T extends DataType>(
      doc: Document<T>,
      options?: SetOptions<T>
   ): Promise<void>;

   abstract getDocument<T extends DataType>(
      doc: Document<T>
   ): Promise<Document<T>>;

   abstract deleteDocument<T extends DataType>(doc: Document<T>): Promise<void>;

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
