import { Document } from './';
import { DataEntity } from './providers';

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
export class Query<T> extends DataEntity {
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
      const d = new Document<T>(this.provider);
      return d;
   }
}
