import { isEqualList } from '@toba/tools';
import { Document, Query } from './';
import { DataType } from './providers';

/**
 * @see https://firebase.google.com/docs/reference/js/firebase.firestore.QuerySnapshot
 */
export class Result<T extends DataType> {
   /**
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.QuerySnapshot#query
    */
   private query: Query<T>;
   private matches: Document<T>[];

   constructor(query: Query<T>, matches: Document<T>[]) {
      this.query = query;
      this.matches = matches;
   }

   /**
    * Array of all documents in the result.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.QuerySnapshot#docs
    */
   docs(): Document<T>[] {
      return this.matches;
   }

   /**
    * True if there are no documents in the result.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.QuerySnapshot#empty
    */
   get empty(): boolean {
      return this.matches.length === 0;
   }

   /**
    * Number of matched documents.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.QuerySnapshot#size
    */
   get size(): number {
      return this.matches.length;
   }

   isEqual(other: Result<T>): boolean {
      const docIDs = this.matches.map(d => d.id);
      const others = other.matches.map(d => d.id);

      return isEqualList(docIDs, others);
   }
}
