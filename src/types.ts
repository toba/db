import { DataClient } from './client';

/**
 * Type of data stored in a `Document`.
 */
export type DataType = {
   [key: string]: any;
   /**
    * The primary document key. If not supplied, a ULID will be generated.
    * @see https://github.com/ulid/javascript
    */
   id?: string;
};

/**
 * `DataType` keys other than the `id`.
 */
export type ExcludeID<T extends DataType> = keyof Pick<
   T,
   Exclude<keyof T, 'id'>
>;

/**
 * An entity with access to the `DataClient`.
 */
export abstract class StoreEntity {
   public client: DataClient;

   constructor(client: DataClient) {
      this.client = client;
   }
}
