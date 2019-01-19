import { Collection, Schema, Document } from './';
import { DataProvider, DataType, DataEntity } from './providers/';

export class Database extends DataEntity {
   schema: Schema;

   constructor(provider: DataProvider, schema: Schema) {
      super(provider);
      this.schema = schema;
   }

   open = () => this.provider.open();

   /**
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Firestore#collection
    */
   async collection<T extends DataType>(id: string): Promise<Collection<T>> {
      const schema = this.schema.collections.find(c => c.name == id);
      if (schema === undefined) {
         return Promise.reject(
            `Collection "${id}" does not exist in database ${this.schema.name}`
         );
      }
      return new Collection<T>(this.provider, schema);
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
