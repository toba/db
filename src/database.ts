import { Collection, Schema, Document } from './';
import { DataProvider, DataType, DataEntity } from './providers/';
import { CollectionSchema } from './schema';

export class Database extends DataEntity {
   /**
    * Schema that defines the collections, their data types and indexes.
    */
   private schema: Schema;

   constructor(provider: DataProvider, schema: Schema) {
      super(provider);
      this.schema = schema;
   }

   open = () => this.provider.open();

   get name() {
      return this.schema.name;
   }

   get version() {
      return this.schema.version;
   }

   /**
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
      return new Collection<T>(this.provider, schema as CollectionSchema<T>);
   }

   /**
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
