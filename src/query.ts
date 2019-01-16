import { Document } from './';

export enum SortDirection {
   Ascending,
   Descending
}

export enum Operator {
   GreaterThan,
   EqualOrGreater,
   LessThan,
   EqualOrLess,
   Equal
}

/**
 * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Query
 */
export class Query<T> {
   limit(count: number): this {
      return this;
   }

   sortBy(
      fieldName: string,
      direction: SortDirection = SortDirection.Ascending
   ): this {
      return this;
   }

   where(fieldPath: string, operator: Operator, value: any): this {
      return this;
   }

   get(): Document<T> {
      const d = new Document();
      return d;
   }
}
