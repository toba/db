import { EventEmitter } from '@toba/tools';
import {
   Collection,
   Document,
   Result,
   Query,
   SetOptions,
   Schema,
   CollectionSchema
} from '../';

/**
 * Type of data stored in a `Document`.
 */
export type DataType = {
   /**
    * The primary document key. If not supplied, a ULID will be generated.
    * @see https://github.com/ulid/javascript
    */
   id?: string;
};

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

   /**
    * Retrieve a single document. A new transaction will always be created to
    * save the document so this operation can always be read-only.
    */
   abstract getDocument<T extends DataType>(
      doc: Document<T>
   ): Promise<Document<T>>;
   abstract getDocument<T extends DataType>(
      collection: CollectionSchema<T>,
      id: string
   ): Promise<Document<T>>;
   abstract getDocument<T extends DataType>(
      docOrSchema: Document<T> | CollectionSchema<T>,
      id?: string
   ): Promise<Document<T>>;

   protected ensureDoc<T extends DataType>(
      docOrSchema: Document<T> | CollectionSchema<T>,
      id?: string
   ): Document<T> {
      if (id !== undefined) {
         const schema = docOrSchema as CollectionSchema<T>;
         const c = new Collection<T>(this, schema);
         return new Document<T>(c, id);
      } else {
         return docOrSchema as Document<T>;
      }
   }

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
