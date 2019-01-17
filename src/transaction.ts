import { Document } from './';
import { SetOptions } from './document';
import { DataEntity } from './providers';

/**
 * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Transaction
 */
export class Transaction<T> extends DataEntity {
   delete(doc: Document<T>): this {
      return this;
   }

   get(doc: Document<T>): T | null {
      return null;
   }

   set(doc: Document<T>, data: T, options: SetOptions): this {
      return this;
   }

   update(doc: Document<T>, data: Partial<T>): this {
      return this;
   }

   forEach(fn: (data: T) => void) {
      return;
   }
}
