import { Document, Query } from './';
import { DataType } from './providers';

/**
 * @see https://firebase.google.com/docs/reference/js/firebase.firestore.QuerySnapshot
 */
export class Result<T extends DataType> {
   private query: Query<T>;
   private matches: Document<T>[];

   constructor(query: Query<T>, matches: Document<T>[]) {
      this.query = query;
      this.matches = matches;
   }

   docs(): Document<T>[] {
      return this.matches;
   }

   /**
    * True if there are no documents in the result.
    */
   get empty(): boolean {
      return this.matches.length === 0;
   }

   get size(): number {
      return this.matches.length;
   }

   isEqual(other: Result<T>): boolean {
      return false;
   }
}
