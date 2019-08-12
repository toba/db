import { Collection, Schema, Document } from './';
import { DataClient } from './client';
import { DataType, StoreEntity } from './types';
import { CollectionSchema } from './schema';

export class Database extends StoreEntity {
   /**
    * Schema that defines the collections, their data types and indexes.
    */
   private schema: Schema;

   constructor(client: DataClient, schema: Schema) {
      super(client);
      this.schema = schema;
   }

   open = () => this.client.open();

   get name() {
      return this.schema.name;
   }

   get version() {
      return this.schema.version;
   }

   /**
    * Gets a `Collection` with the specified `id`.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Firestore#collection
    */
   async collection<T extends DataType>(id: string): Promise<Collection<T>> {
      const schema = this.schema.collections.find(c => c.name == id);
      if (schema === undefined) {
         return Promise.reject(
            `Collection "${id}" does not exist in database ${this.name}`
         );
      }
      // type coercion is needed because the type-specific schemas in
      // .collections are all stored as CollectionSchema<DataType>
      return new Collection<T>(this.client, schema as CollectionSchema<T>);
   }

   /**
    * Gets a Document instance that refers to the document with the specified
    * IDs.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Firestore#doc
    */
   async doc<T extends DataType>(
      collectionID: string,
      docID: string
   ): Promise<Document<T>> {
      const c = await this.collection<T>(collectionID);
      return c.doc(docID);
   }
}
