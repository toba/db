import { Document } from './';
import { SetOptions } from './document';

/**
 * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Transaction
 */
export class Transaction<T> {
   delete(doc: Document<T>): this {
      return this;
   }

   get(doc: Document<T>): T {
      return null;
   }

   set(doc: Document<T>, data: T, options: SetOptions): this {
      return this;
   }

   update(doc: Document<T>, data: Partial<T>): this {
      return this;
   }
}
