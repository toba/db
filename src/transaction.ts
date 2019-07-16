import { Document, SetOptions } from './';
import { StoreEntity, DataType } from './types';

/**
 * A reference to a transaction. The `Transaction` object passed to a
 * transaction's `updateFunction` provides the methods to read and write data
 * within the transaction context. See `Firestore.runTransaction()`.
 * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Transaction
 */
export class Transaction<T extends DataType> extends StoreEntity {
   /**
    * Deletes the document referred to by the provided DocumentReference.
    */
   delete(doc: Document<T>): Promise<void> {
      return doc.delete();
   }

   get(doc: Document<T>): Promise<T | undefined> {
      return Promise.resolve<T | undefined>(doc.data());
   }

   set(doc: Document<T>, values: T, options: SetOptions<T>): this {
      return this;
   }

   update(doc: Document<T>, values: Partial<T>): this {
      return this;
   }

   /**
    * Execute a function for each document in a collection.
    */
   forEach(fn: (values: T) => void) {
      return;
   }
}
