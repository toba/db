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
   limit(count: number) {
      return;
   }

   sortBy(
      fieldName: string,
      direction: SortDirection = SortDirection.Ascending
   ) {
      return;
   }

   where(fieldPath: string, operator: Operator, value: any) {
      return;
   }

   get(): Document<T> {
      return null;
   }
}
