import { Document, Query } from './';

/**
 * @see https://firebase.google.com/docs/reference/js/firebase.firestore.QuerySnapshot
 */
export class Result<T> {
   query: Query<T>;

   docs(): Document<T>[] {
      return [];
   }

   /**
    * True if there are no documents in the result.
    */
   get empty(): boolean {
      return false;
   }

   get size(): number {
      return 0;
   }

   isEqual(other: Result<T>): boolean {
      return false;
   }
}
